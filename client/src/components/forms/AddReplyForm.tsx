import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { addReplyValidation } from "@/lib/validations/PostValidations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImageMinus, ImagePlus, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { setPost } from "@/redux/slices/post";

interface Props {
  parentId: string;
  refetchPost: (id: string) => Promise<void>;
}

const AddReplyForm: React.FC<Props> = ({ parentId, refetchPost }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [picture, setPicture] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const form = useForm({
    resolver: zodResolver(addReplyValidation),
    defaultValues: {
      text: "",
      file: "",
      parentId: parentId,
    },
  });

  const imageHandler = () => {
    const input = document.createElement("input") as HTMLInputElement;
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64string = reader.result as string;
          setPicture(base64string);
          form.setValue("file", base64string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const removeImage = () => {
    form.setValue("file", "");
    setPicture(null);
  };

  const fetchPosts = async (id: string) => {
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

  async function submitForm(values: z.infer<typeof addReplyValidation>) {
    try {
      setLoading(true);
      console.log(values);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BASE_URL}/api/post/comment`,
        {
          method: "POST",
          headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({ variant: "destructive", title: data.message });
        console.log(data);
        return;
      }
      toast({ title: data.message });
      fetchPosts(id!);
    } catch (error: any) {
      toast({ variant: "destructive", title: error.message });
      console.log(error);
    } finally {
      form.reset();
      setPicture(null);
      setLoading(false);
    }
  }

  return (
    <section className="w-full flex gap-2.5 p-3.5 pb-2 border-b">
      <Avatar
        className="cursor-pointer"
        onClick={() => navigate(`/profile/${user?.username}`)}
      >
        <AvatarImage src={user?.img?.secure_url ?? "/default.png"} />
      </Avatar>
      <Form {...form}>
        <form className="flex-1" onSubmit={form.handleSubmit(submitForm)}>
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    id="text"
                    placeholder="Post your reply"
                    className="w-full h-auto resize-y bg-transparent px-2 placeholder:text-muted-foreground"
                    disabled={loading}
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {picture && (
            <img
              src={picture}
              alt="Your Image"
              className="rounded-md object-cover w-[70%] mt-2"
            />
          )}

          <div className="w-full flex items-center gap-5 mt-2">
            <Button
              disabled={loading}
              onClick={picture ? removeImage : imageHandler}
              type="button"
              variant={picture ? "destructive" : "outline"}
              className="rounded-full"
              size="sm"
            >
              {picture ? <ImageMinus size={14} /> : <ImagePlus size={14} />}
            </Button>

            <Button
              disabled={loading}
              size="sm"
              className="text-xs rounded-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white h-auto px-4 py-2"
            >
              {loading && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default AddReplyForm;
