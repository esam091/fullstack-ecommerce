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

async function ensureUserOwnsCollection({
  collectionId,
  userId,
}: {
  collectionId: number;
  userId: string;
}) {
  const result = await db
    .select({ id: shops })
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
        const upsert = await tx
          .insert(catalog)
          .values({
            id: collectionId,
            name: input.name,
            shopId: ctx.shopId,
          })
          .onDuplicateKeyUpdate({
            set: {
              name: data.name,
            },
          });

        const id = collectionId ?? upsert[0].insertId;

        await tx
          .delete(catalogProducts)
          .where(eq(catalogProducts.catalogId, id));

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

      await db.transaction(async (tx) => {
        await tx
          .delete(catalogProducts)
          .where(eq(catalogProducts.catalogId, input));
        await tx.delete(catalog).where(eq(catalog.id, input));
      });
    }),

  myCatalogs: shopOwnerProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        catalog: {
          id: catalog.id,
          name: catalog.name,
        },
        product: {
          id: products.id,
          name: products.name,
          image: products.image,
        },
      })
      .from(catalog)
      .innerJoin(catalogProducts, eq(catalogProducts.catalogId, catalog.id))
      .innerJoin(products, eq(catalogProducts.productId, products.id))
      .where(eq(catalog.shopId, ctx.shopId));

    type ReturnType = {
      catalog: (typeof result)[0]["catalog"];
      products: (typeof result)[0]["product"][];
    };

    const grouped = result.reduce((acc, item) => {
      const existingCatalog = acc.find((c) => c.catalog.id === item.catalog.id);
      if (existingCatalog) {
        existingCatalog.products.push(item.product);
      } else {
        acc.push({
          catalog: item.catalog,
          products: [item.product],
        });
      }
      return acc;
    }, [] as ReturnType[]);

    return grouped;
  }),
});
