import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

import User from "../models/User.model";
import { RequestBody } from "../middlewares/authenticate";
import asyncHandler from "../utils/asyncHandler";
import uploadImage from "../utils/uploadImage";

const COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  path: "/",
};

export const register = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { name, username, email, password, file } = req.body;

    const usernameExists = await User.findOne({ username });
    if (usernameExists) return next(createHttpError(403, "Username is already taken"));
    const emailExists = await User.findOne({ email });
    if (emailExists) return next(createHttpError(403, "Email is already in use"));

    let img;
    if (file) {
      const result = await uploadImage(file, "Avatars");
      if (typeof result === "string")
        return next(createHttpError(400, "Unknown error occured"));
      img = result;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      username,
      email,
      img,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res
      .status(201)
      .cookie("token", token, COOKIE_OPTIONS)
      .json({ message: "User registered successfully" });
  }
);

export const login = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(createHttpError(404, "User not found"));

    const comparePass = await bcrypt.compare(password, user.password!);
    if (!comparePass) return next(createHttpError(403, "Incorrect password"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res
      .status(200)
      .cookie("token", token, COOKIE_OPTIONS)
      .json({ message: "Login successfull" });
  }
);
