import { NextFunction, Response } from "express";

import User, { UserType } from "../models/User.model";
import Post, { PostType } from "../models/Post.model";
import { RequestBody } from "../middlewares/authenticate";

import asyncHandler from "../utils/asyncHandler";
import uploadImage from "../utils/uploadImage";

export const createPost = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { text, files } = req.body;
    const user: UserType | null = await User.findById(req.userId);
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }
    let images: Array<{ secure_url: string; public_id: string }> = [];

    if (files) {
      const uploadAndUpdate = async (file: string) => {
        const response: any = await uploadImage(file, "Posts");
        if (typeof response === "string") {
          return next(
            res.status(400).json({ message: "Unknown error occured" })
          );
        }
        images.push({
          secure_url: response.secure_url,
          public_id: response.public_id,
        });
      };
      // Handling both single and multiple files upload
      if (files instanceof Array) {
        await Promise.all(files.map((file) => uploadAndUpdate(file)));
      } else {
        await uploadAndUpdate(files);
      }
    }

    const newPost = new Post({
      text,
      files: images,
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
