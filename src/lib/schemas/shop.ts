import { z } from "zod";

export const shopSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9 ]+$/i, {
      message: "Name must be alphanumeric and can contain spaces",
    }),
  location: z.string().min(1, "Required"),
  image: z.string({ required_error: "Shop image is required" }),
  turnstileToken: z.string({ required_error: "Required" }),
});
