import { z } from "zod";

export const catalogForm = z.object({
  name: z.string().min(1, "Required").max(30, "30 characters maximum"),
  productIds: z
    .array(z.number())
    .min(2, "Must contain at least 2 items")
    .max(10, "Can only have 10 items maximum"),
});

export type CatalogFormSchema = z.infer<typeof catalogForm>;
