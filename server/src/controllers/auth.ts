import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

import User, { UserType } from "../models/User.model";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, username, email, password, file } = req.body;

    const usernameExists = await User.findOne({ username });
    const emailExists = await User.findOne({ email });

    if (usernameExists || emailExists) {
      res
        .status(403)
        .json({ message: "User with these credentials already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let img: null | { public_id: string; secure_url: string } = null;
    if (file) {
      await cloudinary.uploader
        .upload(file, {
          folder: "Avatars",
        })
        .then((res) => {
          img = {
            public_id: res.public_id,
            secure_url: res.secure_url,
          };
        })
        .catch((err: any) => {
          res.status(400).json({ message: err.message });
        });
    }

    const user = new User({
      name,
      username,
      email,
      img,
      password: hashedPassword,
    });
    await user.save();

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ id: user._id }, secret);

    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
      })
      .json({ message: "User registered successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = (await User.findOne({ username }).select(
      "+password"
    )) as UserType | null;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const comparePass = await bcrypt.compare(password, user.password!);
    if (!comparePass) {
      res.status(403).json({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    res
      .status(201)
      .cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        path: "/",
      })
      .json({ message: "Login successfull" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
