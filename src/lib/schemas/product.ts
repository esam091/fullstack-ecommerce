import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  image: z.string({ required_error: "Product photo is required" }).uuid(),
  price: z.coerce.number().min(0.1).max(10000),
  stock: z
    .string()
    .optional()
    .pipe(
      z
        .number({ invalid_type_error: "Must be a valid number" })
        .int({ message: "Must not be a decimal" })
        .min(1, "Must not be less than 1")
        .max(10000, "Must not be more than 10000"),
    ),
  condition: z.union([z.literal("new"), z.literal("used")]),
  categoryId: z.string({ required_error: "Select a category" }),
});

export type ProductFields = z.infer<typeof productSchema>;
