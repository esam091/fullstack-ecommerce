import { z } from "zod";
import {
  authenticatedProcedure,
  createTRPCRouter,
  shopOwnerProcedure,
} from "../trpc";
import { db } from "@/server/db";
import {
  collectionProducts,
  collections,
  products,
  shops,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const ownedProductAndCollection = authenticatedProcedure
  .input(
    z.object({
      collectionId: z.number(),
      productId: z.number(),
    }),
  )
  .use(async (opts) => {
    const result = await db
      .select({
        shopId: shops.id,
      })
      .from(products)
      .innerJoin(shops, eq(shops.id, products.shopId))
      .innerJoin(collections, eq(collections.shopId, shops.id))
      .where(
        and(
          eq(shops.userId, opts.ctx.auth.userId),
          eq(products.id, opts.input.productId),
          eq(collections.id, opts.input.collectionId),
        ),
      );

    if (result.length !== 1) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return opts.next();
  });

async function ensureUserOwnsCollection({
  collectionId,
  userId,
}: {
  collectionId: number;
  userId: string;
}) {
  const result = await db
    .select({})
    .from(shops)
    .innerJoin(collections, eq(shops.id, collections.shopId))
    .where(
      and(
        eq(shops.userId, userId),
        eq(collections.shopId, shops.id),
        eq(collections.id, collectionId),
      ),
    );

  if (result.length !== 1) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }
}

export const collectionRouter = createTRPCRouter({
  createOrUpdate: shopOwnerProcedure
    .input(
      z.object({
        collectionId: z.number().optional(),
      }),
    )
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { collectionId, ...data } = input;
      if (collectionId) {
        await ensureUserOwnsCollection({
          collectionId: collectionId,
          userId: ctx.auth.userId,
        });
      }

      await db
        .insert(collections)
        .values({
          name: input.name,
          shopId: ctx.shopId,
        })
        .onDuplicateKeyUpdate({
          set: data,
        });
    }),

  delete: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ensureUserOwnsCollection({
        userId: ctx.auth.userId,
        collectionId: input,
      });

      await db.delete(collections).where(eq(collections.id, input));
    }),

  addProduct: ownedProductAndCollection.mutation(async ({ input }) => {
    await db.insert(collectionProducts).values(input);
  }),

  removeProduct: ownedProductAndCollection.mutation(async ({ input }) => {
    await db
      .delete(collectionProducts)
      .where(
        and(
          eq(collectionProducts.productId, input.productId),
          eq(collectionProducts.collectionId, input.collectionId),
        ),
      );
  }),
});
