import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { SignInFormValidation } from "@/lib/validations/UserValidations";
import { useToast } from "@/components/ui/use-toast";

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SignInFormValidation>>({
    resolver: zodResolver(SignInFormValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInFormValidation>) {
    try {
      setLoading(true);
      const response: Response = await fetch(
        `${import.meta.env.VITE_REACT_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast({ variant: "destructive", title: data.message });
        return;
      }
      localStorage.setItem("token", data.token);
      toast({ title: data.message });
      navigate("/home");
      navigate(0);
    } catch (error: unknown) {
      toast({ variant: "destructive", title: "Some error occured" });
      console.log(`Error: ${error}`);
    } finally {
      form.reset();
      setLoading(false);
    }
  }

  return (
    <>
      <DialogHeader className="my-2">
        <img
          src="/logo.svg"
          alt="X Logo"
          width={30}
          height={30}
          className="mx-auto mb-3 dark:invert"
        />
        <DialogTitle className="text-3xl text-justify font-bold">
          Sign in to X
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col justify-start gap-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="text"
                    placeholder="Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    type="password"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} size="lg" className="mt-3" type="submit">
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Sign in
          </Button>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
