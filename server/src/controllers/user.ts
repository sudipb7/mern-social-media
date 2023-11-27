import { NextFunction, Response } from "express";

import User, { UserType } from "../models/User.model";
import { RequestBody } from "../middlewares/authenticate";
import { formatUsers } from "../utils/user";
import asyncHandler from "../utils/asyncHandler";

export const currentUser = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: UserType | null = await User.findById(req.userId);
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }
    res.status(200).json(user);
  }
);

export const getUser = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: UserType | null = await User.findOne({ username: req.params.username });
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }
    if (req.username !== req.params.username) {
      user.impressions += 1;
      await user.save();
    }
    res.status(200).json(user);
  }
);

export const updateUser = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { name, link, profession, location, bio } = req.body;

    if (req.userId !== req.params.id) {
      return next(res.status(403).json({ message: "Not allowed" }));
    }

    const user: UserType | null = await User.findById(req.params.id);
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    user.name = name;
    user.link = link;
    user.profession = profession;
    user.location = location;
    user.bio = bio;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  }
);

export const getFollowingAndFollowers = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: UserType | null = await User.findById(req.params.userId);
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const followersPromises = await Promise.all(user.followers.map((id) => User.findById(id)));
    const followingsPromises = await Promise.all(user.followings.map((id) => User.findById(id)));

    const followers = formatUsers(followersPromises);
    const followings = formatUsers(followingsPromises);

    res.status(200).json({ followers, followings });
  }
);

export const toggleFollowers = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userId, friendId } = req.params;
    if (req.userId !== userId) {
      return next(res.status(403).json({ message: "Not allowed" }));
    }

    const loggedInUser: UserType | null = await User.findById(userId);
    const friend: UserType | null = await User.findById(friendId);
    if (!friend || !loggedInUser) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const isFollowing: boolean = loggedInUser.followings.includes(friendId);
    if (isFollowing) {
      loggedInUser.followings.splice(loggedInUser.followings.indexOf(friendId), 1);
      friend.followers.splice(friend.followers.indexOf(userId), 1);
    } else {
      loggedInUser.followings.push(friendId);
      friend.followers.push(userId);
      friend.impressions += 1;
    }

    await Promise.all([loggedInUser.save(), friend.save()]);
    res.status(200).json(loggedInUser);
  }
);
