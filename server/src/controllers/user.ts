import { Response } from "express";

import User, { UserType } from "../models/User.model";
import { RequestBody } from "../middlewares";
import { formatUsers } from "../utils/user";

export const getUser = async (
  req: RequestBody,
  res: Response
): Promise<void> => {
  try {
    const user: UserType | null = await User.findOne({
      username: req.params.username,
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (
  req: RequestBody,
  res: Response
): Promise<void> => {
  try {
    if (req.userId !== req.params.id) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const user: UserType | null = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { name, link, profession, location, bio } = req.body;

    user.name = name;
    user.link = link;
    user.profession = profession;
    user.location = location;
    user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFollowingAndFollowers = async (
  req: RequestBody,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user: UserType | null = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const followersPromises = user.followers.map((id) => User.findById(id));
    const followingsPromises = user.followings.map((id) => User.findById(id));

    const followers = await Promise.all(followersPromises);
    const followings = await Promise.all(followingsPromises);

    const formattedFollowers = formatUsers(followers);
    const formattedFollowings = formatUsers(followings);

    res
      .status(200)
      .json({ followers: formattedFollowers, followings: formattedFollowings });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const toggleFollowers = async (
  req: RequestBody,
  res: Response
): Promise<void> => {
  try {
    const { userId, friendId } = req.params;

    if (req.userId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const loggedInUser: UserType | null = await User.findById(userId);
    const friend: UserType | null = await User.findById(friendId);
    if (!friend || !loggedInUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isFollowing: boolean = loggedInUser.followings.includes(friendId);

    if (isFollowing) {
      loggedInUser.followings.splice(
        loggedInUser.followings.indexOf(friendId),
        1
      );
      friend.followers.splice(friend.followers.indexOf(userId), 1);
    } else {
      loggedInUser.followings.push(friendId);
      friend.followers.push(userId);
    }

    await Promise.all([loggedInUser.save(), friend.save()]);

    res.status(200).json(loggedInUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
