import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/User.model";
import { RequestBody } from "../middlewares/authenticate";
import asyncHandler from "../utils/asyncHandler";

export const register = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { name, username, email, password } = req.body;

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return next(
        res.status(403).json({ message: "Username is already in use" })
      );
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return next(res.status(403).json({ message: "Email is already in use" }));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res.status(201).json({ message: "User registered successfully", token });
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
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const comparePass = await bcrypt.compare(password, user.password!);
    if (!comparePass) {
      return next(res.status(403).json({ message: "Incorrect password" }));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res.status(200).json({ message: "Login successfull", token });
  }
);
