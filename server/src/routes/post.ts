import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import {
  createPost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/post";

const router = Router();

router.route("/").get(authenticate, getPosts).post(authenticate, createPost);

router
  .route("/:id")
  .get(authenticate, getPostById)
  .patch(authenticate, updatePost);

export default router;
