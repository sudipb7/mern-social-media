import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Response } from "express";

import User, { UserType } from "../models/User.model";
import Post, { PostType } from "../models/Post.model";
import { RequestBody } from "../middlewares/authenticate";

import asyncHandler from "../utils/asyncHandler";

export const createPost = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { text, file } = req.body;
    const user: UserType | null = await User.findById(req.userId);
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }
    let image: { secure_url: string; public_id: string } | null = null;

    if (file) {
      const response = await cloudinary.uploader.upload(file, {
        folder: "Posts",
      });

      image = {
        secure_url: response.secure_url,
        public_id: response.public_id,
      };
    }

    const newPost = new Post({
      text: text,
      image: image,
      author: req.userId,
    });
    const post: PostType = await newPost.save();
    user.posts.push(post._id); // Update the user as well
    await user.save();

    res.status(201).json({ message: "Post created successfully", post, user });
  }
);

export const updatePost = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { text } = req.body;
    const post = await Post.findById(req.params.id).populate("author") as PostType | null;
    if (!post) {
      return next(res.status(404).json({ message: "Post not found" }));
    }

    let postAuthor = post.author as UserType;
    if (req.userId !== postAuthor._id.toString()) {
      return next(res.status(403).json({ message: "Not allowed" }));
    }

    post.text = text;
    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  }
);
