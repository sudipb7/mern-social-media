import mongoose from "mongoose";
import { UserType } from "./User.model";

export interface PostType extends mongoose.Document {
  text: string;
  pinned: boolean;
  impressions: number;
  createdAt: Date;
  image?: { secure_url: string; public_id: string };
  author: mongoose.Schema.Types.ObjectId | UserType;
  parentId: mongoose.Schema.Types.ObjectId | PostType;
  likes: Array<mongoose.Schema.Types.ObjectId | UserType>;
  bookmarks: Array<mongoose.Schema.Types.ObjectId | UserType>;
  children: Array<mongoose.Schema.Types.ObjectId | PostType>;
}

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    public_id: { type: String },
    secure_url: { type: String },
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  impressions: {
    type: Number,
    default: 0,
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
