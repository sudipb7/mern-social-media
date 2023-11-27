import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import asyncHandler from "../utils/asyncHandler";
import User, { UserType } from "../models/User.model";

export interface RequestBody extends Request {
  userId?: string;
  username?: string;
}

export const authenticate = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers['authorization'];
    if (!token) return next(res.status(401).json({ message: "Unauthorized" }));

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user: UserType | null = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return next(res.status(404).json({ message: "User not found" }));
    }

    req.userId = user._id.toString();
    req.username = user.username;
    return next();
  }
);
