import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Must contain 3 characters minimum")
    .max(100, "Must not exceed 100 characters"),
  description: z
    .string()
    .min(10, "Must contain 10 characters minimum")
    .max(500, "Must not exceed 500 characters"),
  image: z.string({ required_error: "Product photo is required" }).uuid(),
  price: z
    .number({ coerce: true })
    .min(0.1, "Must not be less than $0.1")
    .max(10000, "Must not be more than $10000"),
  stock: z
    .number({ coerce: true, invalid_type_error: "Must be a valid number" })
    .int({ message: "Must not be a decimal" })
    .nullable()
    .superRefine((value, ctx) => {
      if (!value) {
        return;
      }

      if (value < 1 || value > 10000) {
        ctx.addIssue({
          message: "Must be between 1 and 10000",
          code: "custom",
        });
      }
    }),
  condition: z.union([
    z.literal("new", {
      errorMap: () => ({
        // Can't get correct error message unless I put it here
        message: "Pick one of the options",
      }),
    }),
    z.literal("used"),
  ]),
  categoryId: z.string({ required_error: "Select a category" }),
});

export type ProductFields = z.infer<typeof productSchema>;
