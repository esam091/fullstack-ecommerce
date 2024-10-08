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
  categoryId: z.number({ coerce: true, required_error: "Select a category" }),
  turnstileToken: z.string({ required_error: "Required" }),
});

export type ProductFields = z.infer<typeof productSchema>;

export const searchSchema = z.object({
  keyword: z.string().optional(),
  minPrice: z.number({ coerce: true }).optional().catch(undefined),
  maxPrice: z.number({ coerce: true }).optional().catch(undefined),
  new: z.boolean().optional(),
  used: z.boolean().optional(),
  categoryIds: z.number({ coerce: true }).array().optional(),
  sort: z
    .union([
      z.literal("p_asc").describe("Cheapest"),
      z.literal("p_desc").describe("Most Expensive"),
      z.literal("new").describe("Newest"),
      z.literal("old").describe("Oldest"),
    ])
    .optional()
    .catch(undefined),
  page: z.number({ coerce: true }).optional().catch(undefined),
});

export type ProductSearchParams = z.TypeOf<typeof searchSchema>;
export type ProductSearchParamsInput = z.input<typeof searchSchema>;
