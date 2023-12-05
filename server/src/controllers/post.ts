import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Response } from "express";

import User, { UserType } from "../models/User.model";
import Post, { PostType } from "../models/Post.model";
import { RequestBody } from "../middlewares/authenticate";

import asyncHandler from "../utils/asyncHandler";

export const getPosts = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const page = +req.query.page! || 1;
    const pageSize = +req.query.pageSize! || 10;

    const skipAmount = (page - 1) * pageSize;
    const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "descending" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      });

    const posts = await postsQuery.exec() as PostType[] | null;
    if (!posts) {
      return next(res.status(404).json({ message: "Posts not found" }));
    }

    const totalPosts = await Post.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const totalPages = Math.ceil(totalPosts / pageSize);
    const isNext = totalPosts >= skipAmount + posts.length

    res.status(200).json({
      page,
      pageSize,
      totalPages,
      totalPosts,
      isNext,
      posts,
    });
  }
);

export const getBookmarks = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = await User.findById(req.params.id) as UserType | null;
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const page = +req.query.page! || 1;
    const pageSize = +req.query.pageSize! || 10;

    const skipAmount = (page - 1) * pageSize;
    const postsQuery = Post.find({ _id: { $in: user.bookmarks } })
      .sort({ createdAt: "descending" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      });

    const posts = await postsQuery.exec() as PostType[] | null;
    if (!posts) {
      return next(res.status(404).json({ message: "Posts not found" }));
    }

    const totalPosts = await Post.countDocuments({
      _id: { $in: user.bookmarks },
    });
    const totalPages = Math.ceil(totalPosts / pageSize);
    const isNext = totalPosts >= skipAmount + posts.length;

    res.status(200).json({
      page,
      pageSize,
      totalPages,
      totalPosts,
      isNext,
      posts,
    });
  }
);

export const getPostById = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children", // populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
          },
          {
            path: "children", // Populate the children field within children
            model: Post, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
            },
          },
        ],
      })
      .exec();
    if (!post) {
      return next(res.status(404).json({ message: "Post not found" }));
    }
    res.status(200).json({ message: "Post fetched successfully", post });
  }
);

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
      text,
      image,
      author: req.userId,
    });
    const post: PostType = await newPost.save();
    user.posts.push(post._id); // Update the user as well
    await user.save();

    res.status(201).json({ message: "Your post was sent", post, user });
  }
);

export const toggleLikes = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const post = await Post.findById(req.params.id).populate("author") as PostType | null;
    if (!post) {
      return next(res.status(404).json({ message: "Post not found" }));
    }
    const user = await User.findById(req.userId) as UserType | null;
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const isLiked: boolean = post.likes.includes(user._id) && user.likedPosts.includes(post._id);
    if (isLiked) {
      post.likes.splice(post.likes.indexOf(user._id), 1);
      user.likedPosts.splice(user.likedPosts.indexOf(post._id), 1);
    } else {
      post.likes.push(user._id);
      user.likedPosts.push(post._id);
    }

    await Promise.all([post.save(), user.save()]);

    res.status(200).json({ post, user });
  }
);

export const toggleBookmarks = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const post = await Post.findById(req.params.id).populate("author") as PostType | null;
    if (!post) {
      return next(res.status(404).json({ message: "Post not found" }));
    }
    const user = await User.findById(req.userId) as UserType | null;
    if (!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }

    const isBookmarked: boolean = post.bookmarks.includes(user._id) && user.bookmarks.includes(post._id);
    if (isBookmarked) {
      post.bookmarks.splice(post.bookmarks.indexOf(user._id), 1);
      user.bookmarks.splice(user.bookmarks.indexOf(post._id), 1);
    } else {
      post.bookmarks.push(user._id);
      user.bookmarks.push(post._id);
    }

    await Promise.all([post.save(), user.save()]);

    const message = isBookmarked
      ? "Removed from your bookmarks"
      : "Added to your bookmarks";

    res.status(200).json({ message, post, user });
  }
);

export const addReplyToPost = asyncHandler(
  async (
    req: RequestBody,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { text, file, parentId } = req.body;
    const user = await User.findById(req.userId) as UserType | null;
    if(!user) {
      return next(res.status(404).json({ message: "User not found" }));
    }
    const originalPost = await Post.findById(parentId) as PostType | null;
    if(!originalPost) {
      return next(res.status(404).json({ message: "Post not found" }));
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

    const newComment = new Post({
      parentId,
      text,
      image,
      author: req.userId
    });
    const comment: PostType = await newComment.save();

    user.posts.push(comment._id);
    originalPost.children.push(comment._id);

    await Promise.all([user.save(), originalPost.save()]);

    res.status(201).json({ message: "Your post was sent", user, originalPost, comment });
  }
);