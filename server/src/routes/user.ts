import { Router } from "express";

import { authenticate } from "../middlewares/authenticate";
import {
  getFollowingAndFollowers,
  getUser,
  toggleFollowers,
  updateUser,
} from "../controllers/user";

const router = Router();

router.route("/profile/:username").get(getUser);

router.route("/:id").patch(authenticate, updateUser);

router.route("/followers/:userId").get(authenticate, getFollowingAndFollowers);

router
  .route("/followers/:userId/:friendId")
  .patch(authenticate, toggleFollowers);

export default router;
