import { z } from "zod";
import {
  authenticatedProcedure,
  createTRPCRouter,
  shopOwnerProcedure,
} from "../trpc";
import { db } from "@/server/db";
import { catalogProducts, catalog, products, shops } from "@/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { catalogForm } from "@/lib/schemas/catalog";

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
      .innerJoin(catalog, eq(catalog.shopId, shops.id))
      .where(
        and(
          eq(shops.userId, opts.ctx.auth.userId),
          eq(products.id, opts.input.productId),
          eq(catalog.id, opts.input.collectionId),
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
    .select({ id: shops.id })
    .from(shops)
    .innerJoin(catalog, eq(shops.id, catalog.shopId))
    .where(
      and(
        eq(shops.userId, userId),
        eq(catalog.shopId, shops.id),
        eq(catalog.id, collectionId),
      ),
    );

  if (result.length !== 1) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }
}

export const catalogRouter = createTRPCRouter({
  createOrUpdate: shopOwnerProcedure
    .input(
      z.object({
        collectionId: z.number().optional(),
      }),
    )
    .input(catalogForm)
    .mutation(async ({ ctx, input }) => {
      const { collectionId, ...data } = input;
      if (collectionId) {
        await ensureUserOwnsCollection({
          collectionId: collectionId,
          userId: ctx.auth.userId,
        });
      }

      const aa = await db
        .select({ id: products.id })
        .from(products)
        .where(
          and(
            eq(products.shopId, ctx.shopId),
            inArray(products.id, data.productIds),
          ),
        );

      if (aa.length !== data.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      await db.transaction(async (tx) => {
        console.log("upsert");
        const upsert = await tx
          .insert(catalog)
          .values({
            name: input.name,
            shopId: ctx.shopId,
          })
          .onDuplicateKeyUpdate({
            set: {
              name: data.name,
            },
          });

        const id = collectionId ?? upsert[0].insertId;

        console.log("delete");
        await tx
          .delete(catalogProducts)
          .where(eq(catalogProducts.catalogId, id));

        console.log("insert");
        await tx.insert(catalogProducts).values(
          data.productIds.map((productId) => ({
            catalogId: id,
            productId,
          })),
        );
      });
    }),

  delete: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ input, ctx }) => {
      await ensureUserOwnsCollection({
        userId: ctx.auth.userId,
        collectionId: input,
      });

      await db.delete(catalog).where(eq(catalog.id, input));
    }),

  addProduct: ownedProductAndCollection.mutation(async ({ input }) => {
    await db.insert(catalogProducts).values([]);
  }),

  removeProduct: ownedProductAndCollection.mutation(async ({ input }) => {
    await db
      .delete(catalogProducts)
      .where(
        and(
          eq(catalogProducts.productId, input.productId),
          eq(catalogProducts.catalogId, input.collectionId),
        ),
      );
  }),
});
