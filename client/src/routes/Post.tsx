import PostCard from "@/components/cards/PostCard";
import AddReplyForm from "@/components/forms/AddReplyForm";
import Header from "@/components/shared/Header";
import { useToast } from "@/components/ui/use-toast";
import { setPost } from "@/redux/slices/post";
import { RootState } from "@/redux/store";
import { Frown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Post: React.FC = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(false);
  const posts = useSelector((state: RootState) => state.post.posts);

  const fetchPost = async (id: string): Promise<void> => {
    setLoading(true);
    dispatch(setPost([]));
    const response = await fetch(
      `${import.meta.env.VITE_REACT_BASE_URL}/api/post/${id}`,
      {
        method: "GET",
        headers: { authorization: `${token}` },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      console.log(data);
      toast({ variant: "destructive", title: data?.message });
    }
    console.log(data.post);
    dispatch(setPost([data.post, ...data.post.children]));
  };

  useEffect(() => {
    fetchPost(id!);
    setLoading(false);
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin" color="#1A8CD8" />
      </div>
    );
  }

  if (!loading && !posts) {
    return (
      <div className="w-full p-4">
        <p className="text-2xl font-semibold text-center">Post not found</p>
        <Frown className="mx-auto mt-2" size={28} />
      </div>
    );
  }

  return (
    <>
      <Header title="Post" isHide={false} />

      <PostCard key={posts[0]?._id} {...posts[0]} />

      <AddReplyForm parentId={posts[0]?._id} refetchPost={fetchPost} />

      {posts && posts?.map((post) => {
        if (post._id !== posts[0]?._id) {
          return <PostCard key={post._id} {...post} />;
        }
      })}
    </>
  );
};

export default Post;
