export interface User {
  _id: string;
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
  posts: Array<Post | string>;
  likesPosts: Array<Post | string>;
  bookmarks: Array<Post | string>;
  followers: Array<User | string>;
  followings: Array<User | string>;
}

export interface Post {
  _id: string;
  text?: string;
  pinned: boolean;
  impressions: number;
  createdAt: Date;
  files?: { secure_url: string; public_id: string };
  author: User | string;
  parentId: Post | string;
  likes: Array<string | User>;
  bookmarks: Array<string | User>;
  children: Array<string | Post>;
}
