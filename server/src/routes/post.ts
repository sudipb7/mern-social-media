import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import {
  createPost,
  getBookmarks,
  getPostById,
  getPosts,
  toggleBookmarks,
  toggleLikes,
} from "../controllers/post";

const router = Router();

router.route("/").get(authenticate, getPosts).post(authenticate, createPost);

router
  .route("/:id")
  .get(authenticate, getPostById)
  .patch(authenticate, toggleLikes);

router
  .route("/bookmark/:id")
  .get(authenticate, getBookmarks)
  .patch(authenticate, toggleBookmarks);

export default router;
