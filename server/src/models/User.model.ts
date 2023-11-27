import mongoose from "mongoose";

export interface UserType extends mongoose.Document {
  username: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  profession?: string;
  location?: string;
  link?: string;
  impressions: number;
  verified: boolean;
  createdAt: Date;
  img?: { secure_url: string; public_id: string };
  coverImg?: { secure_url: string; public_id: string };
  posts: Array<mongoose.Schema.Types.ObjectId>;
  likesPosts: Array<mongoose.Schema.Types.ObjectId>;
  bookmarks: Array<mongoose.Schema.Types.ObjectId>;
  followers: Array<mongoose.Schema.Types.ObjectId | UserType | string>;
  followings: Array<mongoose.Schema.Types.ObjectId | UserType | string>;
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  img: {
    secure_url: { type: String },
    public_id: { type: String },
  },
  coverImg: {
    secure_url: { type: String },
    public_id: { type: String },
  },
  name: {
    type: String,
    required: true,
  },
  impressions: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  bio: { type: String },
  link: { type: String },
  location: { type: String },
  profession: { type: String },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
