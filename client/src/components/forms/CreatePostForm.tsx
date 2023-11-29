import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostValidation } from "@/lib/validations/PostValidations";
import type { RootState } from "@/redux/store";

import { ImageMinus, ImagePlus, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/slices/auth";

const CreatePostForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth?.user);
  const token = useSelector((state: RootState) => state.auth?.token);

  const [loading, setLoading] = useState<boolean>(false);
  const [picture, setPicture] = useState<string | null>(null);

  const form = useForm<z.infer<typeof createPostValidation>>({
    resolver: zodResolver(createPostValidation),
    defaultValues: {
      file: "",
      text: "",
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

  async function onSubmit(values: z.infer<typeof createPostValidation>) {
    try {
      setLoading(true);
      console.log(values);
      const response = await fetch(
        `${import.meta.env.VITE_REACT_BASE_URL}/api/post`,
        {
          method: "POST",
          headers: {
            authorization: `${token!}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({ variant: "destructive", title: data.message });
        return;
      }
      toast({ title: data.message });
      dispatch(setUser(data.user));
      navigate(`posts/${data.post._id}`);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to post" });
      console.log(error);
    } finally {
      setPicture(null);
      form.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <div className="my-4">
        <img
          src="/logo.svg"
          alt="X Logo"
          width={30}
          height={30}
          className="mx-auto mb-3 dark:invert max-sm:hidden"
        />
        <div className="text-3xl text-justify font-bold flex items-center gap-3">
          <img
            src={user?.img?.secure_url ?? "/default.png"}
            alt={`${user?.username}'s Profile Picture`}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          Compose a tweet
        </div>
      </div>
      <Form {...form}>
        <form
          className="w-full flex flex-col max-sm:gap-5 gap-3.5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    id="text"
                    placeholder="What is happening?!"
                    className="w-full outline-none resize-none bg-transparent px-2 placeholder:text-muted-foreground"
                    rows={5}
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
              className="rounded-md object-cover w-[70%]"
            />
          )}

          <Button
            disabled={loading}
            onClick={picture ? removeImage : imageHandler}
            type="button"
            variant={picture ? "destructive" : "outline"}
            className="w-fit"
          >
            {picture ? "Remove picture" : "Add picture"}
            {picture ? (
              <ImageMinus size={14} className="ml-2" />
            ) : (
              <ImagePlus size={14} className="ml-2" />
            )}
          </Button>

          <Button disabled={loading} size="lg">
            {loading && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
            Post
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CreatePostForm;
