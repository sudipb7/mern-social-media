import { useNavigate } from "react-router-dom";
import { Activity, Bookmark, Dot, Heart, MessageCircle } from "lucide-react";

import { Avatar, AvatarImage } from "../ui/avatar";
import type { Post, User } from "@/lib/types";
import { postDateFormatter } from "@/lib/utils";

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
  const navigate = useNavigate();
  const relativeTime = postDateFormatter(`${createdAt}`);

  return (
    <article className="border-b w-full flex items-start justify-center px-5 py-3 gap-3.5 hover:bg-muted/10 transition-all duration-200 ease-in-out">
      <div className="flex flex-col justify-start items-center gap-3 cursor-pointer">
        <Avatar>
          <AvatarImage src={author.img?.secure_url ?? "/default.png"} />
        </Avatar>
      </div>

      <div className="flex-1 flex flex-col justify-center items-start">
        <div
          onClick={() => navigate(`/profile/${author.username}`)}
          className="w-full leading-relaxed flex items-center"
        >
          <h5 className="text-sm font-semibold hover:underline transition-all ease-in-out duration-200 mr-2 cursor-pointer">
            {author.name}
          </h5>
          <p className="text-sm font-light text-muted-foreground cursor-pointer">
            @{author.username}
          </p>
          <Dot className="text-muted-foreground cursor-pointer" size={14} />
          <p className="text-sm font-light text-muted-foreground cursor-pointer">
            {relativeTime}
          </p>
        </div>

        <p className="w-full text-sm font-light">{text}</p>

        {image && (
          <div className="w-full mt-3">
            <img
              src={image.secure_url}
              alt="Post's picture"
              className="rounded-2xl object-cover border"
            />
          </div>
        )}

        {/* TODO: Make these buttons functional */}
        <div className="w-full pr-6 mt-3 flex justify-between items-center">
          <div
            onClick={() => navigate(`/post/${_id}`)}
            className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out"
          >
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#1D9BF0] group-hover:bg-[#1D9BF0]/20">
              <MessageCircle size={16} />
            </button>
            <span className="text-sm group-hover:text-[#1D9BF0] transition-all duration-200 ease-in-out">
              {children.length}
            </span>
          </div>

          <div className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out">
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#F92184] group-hover:bg-[#F92184]/20">
              <Heart size={16} />
            </button>
            <span className="text-sm group-hover:text-[#F92184] transition-all duration-200 ease-in-out">
              {likes.length}
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

          <div className="h-full cursor-pointer flex items-center gap-1 text-muted-foreground group transition-all duration-200 ease-in-out">
            <button className="transition-all duration-200 ease-in-out p-2 rounded-full group-hover:text-[#00BA7C] group-hover:bg-[#00BA7C]/20">
              <Bookmark size={16} />
            </button>
            <span className="text-sm group-hover:text-[#00BA7C] transition-all duration-200 ease-in-out">
              {bookmarks.length}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
