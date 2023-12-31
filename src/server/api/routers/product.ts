import { productSchema } from "@/lib/schemas/product";
import { createTRPCRouter, shopOwnerProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";

export const productRouter = createTRPCRouter({
  create: shopOwnerProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      await db.insert(products).values({
        ...input,
        shopId: ctx.shopId,
      });
    }),
});
