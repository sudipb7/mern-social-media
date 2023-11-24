import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import { createPost, updatePost } from "../controllers/post";

const router = Router();

router.route("/").post(authenticate, createPost);

router.route("/:id").get().patch(authenticate, updatePost);

export default router;
