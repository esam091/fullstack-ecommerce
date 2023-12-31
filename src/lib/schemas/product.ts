import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  image: z.string({ required_error: "Product photo is required" }).uuid(),
  price: z.number().min(0.1).max(10000),
});

export type ProductFields = z.infer<typeof productSchema>;
