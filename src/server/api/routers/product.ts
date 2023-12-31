import { ProductFields, productSchema } from "@/lib/schemas/product";
import {
  authenticatedProcedure,
  createTRPCRouter,
  shopOwnerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { products, shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const productIdInput = z.object({
  productId: z.number(),
});

const ownProductProcedure = authenticatedProcedure
  .input(productIdInput)
  .use(async (opts) => {
    const result = await db
      .select({})
      .from(products)
      .innerJoin(shops, eq(shops.id, products.id));

    if (!result.length) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return opts.next();
  });

export const productRouter = createTRPCRouter({
  create: shopOwnerProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      await db
        .insert(products)
        .values({
          ...input,
          shopId: ctx.shopId,
        })
        .onDuplicateKeyUpdate({
          set: input,
        });
    }),

  update: ownProductProcedure
    .input(productSchema)
    .mutation(async ({ input }) => {
      await db
        .update(products)
        .set(input)
        .where(eq(products.id, input.productId));
    }),

  delete: ownProductProcedure.mutation(async ({ input }) => {
    await db.delete(products).where(eq(products.id, input.productId));
  }),

  myProducts: shopOwnerProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(products)
      .where(eq(products.shopId, ctx.shopId));
  }),
});
