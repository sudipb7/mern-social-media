import { UserType } from "../models/User.model";

export const formatUsers = (users: UserType[]) => {
  return users.map(
    ({ _id, username, name, img, followers, followings, verified, bio }) => {
      return {
        _id,
        username,
        name,
        img,
        followers,
        followings,
        verified,
        bio,
      };
    }
  );
};
