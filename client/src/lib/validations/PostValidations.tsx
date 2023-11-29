import * as z from "zod";

export const createPostValidation = z.object({
  text: z
    .string()
    .min(1, { message: "Required" })
    .max(300, { message: "Only upto 300 characters is allowed." }),
  file: z.string(),
});
