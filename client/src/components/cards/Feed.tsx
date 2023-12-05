import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Post } from "@/lib/types";
import type { RootState } from "@/redux/store";
import PostCard from "./PostCard";
import { setPost } from "@/redux/slices/post";

import { Frown, Loader2 } from "lucide-react";

interface Props {
  api: string;
}

interface Data {
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
  isNext: boolean;
  posts: Post[];
}

const Feed: React.FC<Props> = ({ api }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const posts = useSelector((state: RootState)=> state.post?.posts);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    const res = await fetch(`${import.meta.env.VITE_REACT_BASE_URL}/api${api}?page=${page}&pageSize=10`, {
      method: "GET",
      headers: { authorization: `${token}` },
    });
    const data: Data = await res.json();
    setHasMore(data.isNext);
    setLoading(false);
    dispatch(setPost(page === 1 ? data.posts : [...posts, ...data.posts]));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore) {
        setLoading(true);
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (hasMore) fetchPosts();
    if (!hasMore) setLoading(false);
    // eslint-disable-next-line
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, []);

  if(!loading && !posts.length) {
    return (
      <div className="w-full p-4">
        <p className="text-2xl font-semibold text-center">
          No Posts to show
        </p>
        <Frown className="mx-auto mt-2" size={28} />
      </div>
    )
  }

  return (
    <div className="w-full">
      {posts && posts.map((post) => <PostCard key={post._id} {...post} />)}

      {loading && posts && (
        <div className="w-full flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" color="#1A8CD8" />
        </div>
      )}
    </div>
  );
};

export default Feed;
