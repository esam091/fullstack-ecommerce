import { productSchema } from "@/lib/schemas/product";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
  shopOwnerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { products, shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
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

  getDetail: publicProcedure.input(productIdInput).query(async ({ input }) => {
    return db
      .select()
      .from(products)
      .where(eq(products.id, input.productId))
      .then((products) => {
        const product = products[0];
        return product;
      });
  }),
});
