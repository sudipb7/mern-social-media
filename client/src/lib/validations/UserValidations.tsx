import * as z from "zod";

export const SignUpFormValidation = z.object({
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(30, { message: "Maximum 30 characters" }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(30, { message: "Maximum 30 characters" }),
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be of atleast 8 characters" }),
});

export const SignInFormValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters" })
    .max(30, { message: "Maximum 30 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be of atleast 8 characters" }),
});
