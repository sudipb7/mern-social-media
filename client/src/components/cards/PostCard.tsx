import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Activity, Bookmark, Dot, Heart, MessageCircle } from "lucide-react";

import type { Post, User } from "@/lib/types";
import type { RootState } from "@/redux/store";
import { updatePost } from "@/redux/slices/post";
import { setUser } from "@/redux/slices/auth";
import { postDateFormatter } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { Avatar, AvatarImage } from "../ui/avatar";

interface Props extends Post {
  author: User;
}

const PostCard: React.FC<Props> = ({
  _id,
  author,
  bookmarks,
  children,
  parentId,
  text,
  image,
  impressions,
  createdAt,
  likes,
}) => {
  const relativeTime = postDateFormatter(`${createdAt}`);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const user = useSelector((state: RootState) => state.auth?.user)!;
  const token = useSelector((state: RootState) => state.auth?.token);
  const [isLiked, setIsLiked] = useState<boolean>(likes?.includes(user?._id));
  const [isBookmarked, setIsBookmarked] = useState<boolean>(bookmarks?.includes(user?._id));

  const toggleLike = async (): Promise<void> => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BASE_URL}/api/post/${_id}`,
      {
        method: "PATCH",
        headers: { authorization: `${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data.message);
      return;
    }
    setIsLiked((prev) => !prev);
    dispatch(updatePost(data.post));
    dispatch(setUser(data.user));
  };

  const toggleBookmark = async (): Promise<void> => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BASE_URL}/api/post/bookmark/${_id}`,
      {
        method: "PATCH",
        headers: { authorization: `${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data.message);
      return;
    }
    setIsBookmarked((prev) => !prev);
    dispatch(updatePost(data.post));
    dispatch(setUser(data.user));
    toast({ title: data.message });
  };

  return (
    <article className="border-b w-full flex items-start justify-center px-5 py-3 gap-3.5 hover:bg-muted/10 transition-all duration-200 ease-in-out">
      <div className="flex flex-col justify-start items-center gap-3 cursor-pointer">
        <Avatar>
          <AvatarImage src={author?.img?.secure_url ?? "/default.png"} />
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col justify-center items-start">
        <div
          onClick={() => navigate(`/profile/${author?.username}`)}
          className="w-full leading-relaxed flex items-center"
        >
          <h5 className="text-sm font-semibold hover:underline transition-all ease-in-out duration-200 mr-2 cursor-pointer">
            {author?.name}
          </h5>
          <p className="text-sm font-light text-muted-foreground cursor-pointer">
            @{author?.username}
          </p>
          <Dot className="text-muted-foreground cursor-pointer" size={14} />
          <p className="text-sm font-light text-muted-foreground cursor-pointer">
            {relativeTime}
          </p>
        </div>

        <p
          onClick={() => navigate(`/posts/${_id}`)}
          className="w-full text-sm font-light cursor-pointer"
        >
          {text}
        </p>

        {image && (
          <div
            onClick={() => navigate(`/posts/${_id}`)}
            className="w-full mt-3 cursor-pointer"
          >
            <img
              src={image.secure_url}
              alt="Post's picture"
              className="rounded-2xl object-cover border"
            />
          </div>
        )}

        <div className="w-full pr-6 mt-3 flex justify-between items-center">
          <div
            onClick={() => navigate(`/posts/${_id}`)}
            className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out"
          >
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#1D9BF0] group-hover:bg-[#1D9BF0]/20">
              <MessageCircle size={16} />
            </button>
            <span className="text-sm group-hover:text-[#1D9BF0] transition-all duration-200 ease-in-out">
              {children?.length}
            </span>
          </div>

          <div
            onClick={toggleLike}
            className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out"
          >
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#F92184] group-hover:bg-[#F92184]/20">
              <Heart
                className={`${isLiked && "text-[#F92184] fill-current"}`}
                size={16}
              />
            </button>
            <span
              className={`${
                isLiked && "text-[#F92184]"
              } text-sm group-hover:text-[#F92184] transition-all duration-200 ease-in-out`}
            >
              {likes?.length}
            </span>
          </div>

          <div className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out">
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#1D9BF0] group-hover:bg-[#1D9BF0]/20">
              <Activity size={16} />
            </button>
            <span className="text-sm group-hover:text-[#1D9BF0] transition-all duration-200 ease-in-out">
              {impressions}
            </span>
          </div>

          <div
            onClick={toggleBookmark}
            className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out"
          >
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#00BA7C] group-hover:bg-[#00BA7C]/20">
              <Bookmark
                className={`${isBookmarked && "text-[#00BA7C] fill-current"}`}
                size={16}
              />
            </button>
            <span
              className={`${
                isBookmarked && "text-[#00BA7C]"
              }text-sm group-hover:text-[#00BA7C] transition-all duration-200 ease-in-out`}
            >
              {bookmarks?.length}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
