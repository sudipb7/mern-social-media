import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import {
  currentUser,
  getFollowingAndFollowers,
  getUser,
  toggleFollowers,
  updateAvatar,
  updateCover,
  updateUser,
} from "../controllers/user";

const router = Router();

router.route("/").get(authenticate, currentUser);

router.route("/profile/:username").get(authenticate, getUser);

router.route("/profile/:id").patch(authenticate, updateUser);

router.route("/avatar/:id").patch(authenticate, updateAvatar);

router.route("/cover/:id").patch(authenticate, updateCover);

router.route("/followers/:userId").get(authenticate, getFollowingAndFollowers);

router
  .route("/followers/:userId/:friendId")
  .patch(authenticate, toggleFollowers);

export default router;
