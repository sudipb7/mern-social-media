import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import {
  currentUser,
  getFollowingAndFollowers,
  getUser,
  toggleFollowers,
  updateUser,
} from "../controllers/user";

const router = Router();

router.route("/").get(authenticate, currentUser);

router.route("/profile/:username").get(authenticate, getUser);

router.route("/:id").patch(authenticate, updateUser);

router.route("/followers/:userId").get(authenticate, getFollowingAndFollowers);

router
  .route("/followers/:userId/:friendId")
  .patch(authenticate, toggleFollowers);

export default router;
