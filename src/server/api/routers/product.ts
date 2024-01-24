import { productSchema } from "@/lib/schemas/product";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
  shopOwnerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { categories, products, shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

const productIdInput = z.object({
  productId: z.number(),
});

const ownProductProcedure = authenticatedProcedure
  .input(productIdInput)
  .use(async (opts) => {
    const result = await db
      .select({ productId: products.id })
      .from(products)
      .innerJoin(shops, eq(shops.id, products.shopId))
      .where(
        and(
          eq(shops.userId, opts.ctx.auth.userId),
          eq(products.id, opts.input.productId),
        ),
      );

    if (!result.length) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return opts.next();
  });

export const productRouter = createTRPCRouter({
  createOrUpdate: shopOwnerProcedure
    .input(z.object({ productId: z.number().optional() }))
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.productId) {
        const result = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.id, input.productId),
              eq(products.shopId, ctx.shopId),
            ),
          );

        if (!result.length) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }
      }

      const { productId, ...data } = input;

      await db
        .insert(products)
        .values({
          ...input,
          id: productId,
          shopId: ctx.shopId,
        })
        .onDuplicateKeyUpdate({
          set: data,
        });
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

  getDetail: publicProcedure
    .input(productIdInput)
    .input(z.object({ onlyMine: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.db
        .select({
          product: getTableColumns(products),
          userId: shops.userId,
        })
        .from(products)
        .innerJoin(shops, eq(shops.id, products.shopId))
        .where(eq(products.id, input.productId))
        .then((products) => products[0]);

      if (input.onlyMine && result?.userId !== ctx.auth.userId) {
        return undefined;
      }

      return result?.product;
    }),

  getCategories: publicProcedure.query(async () => {
    return db.select().from(categories);
  }),
});
