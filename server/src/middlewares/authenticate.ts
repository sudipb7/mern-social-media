import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
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
    const token = req.cookies.token;
    if (!token) return next(createHttpError(401, "Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user: UserType | null = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return next(createHttpError(404, "User not found"));
    }

    req.userId = user._id.toString();
    req.username = user.username;
    return next();
  }
);
