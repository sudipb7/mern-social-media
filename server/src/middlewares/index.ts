import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import User, { UserType } from "../models/User.model";

export interface RequestBody extends Request {
  userId?: string;
  username?: string;
}

export const authenticate = async (
  req: RequestBody,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: mongoose.Schema.Types.ObjectId;
    };
    const user: UserType | null = await User.findById(decoded.id);
    if (!user) {
      return res
        .clearCookie("token")
        .status(401)
        .json({ message: "Unauthorized" });
    }

    req.userId = user._id.toString();
    req.username = user.username;
    return next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
