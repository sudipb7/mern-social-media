import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

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
  const [posts, setPosts] = useState<Post[]>([]);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    const res = await fetch(`${import.meta.env.VITE_REACT_BASE_URL}/api${api}?page=${page}&pageSize=10`, {
      method: "GET",
      headers: { authorization: `${token}` },
    });
    const data: Data = await res.json();
    setPosts([...posts, ...data.posts]);
    setHasMore(data.isNext);
    setLoading(false);
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

  return (
    <div className="w-full">
      {posts && posts.map((post) => <PostCard key={post._id} {...post} />)}
      {loading && (
        <div className="w-full flex items-center justify-center p-2">
          <Loader2 className="h-6 w-6 animate-spin" color="#1A8CD8" />
        </div>
      )}
    </div>
  );
};

export default Feed;
