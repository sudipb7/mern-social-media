import type { Post } from "@/lib/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  posts: Post[];
};

const initialState: State = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.push(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const updatedPosts = state.posts.map((post: Post) => {
        if (post._id === action.payload._id) return action.payload;
        return post;
      });
      state.posts = updatedPosts;
    },
    removePost: (state, action: PayloadAction<Post>) => {
      state.posts.splice(state.posts.indexOf(action.payload), 1);
    },
  },
});

export const { setPost, addPost, updatePost, removePost } = postSlice.actions;
export default postSlice.reducer;
