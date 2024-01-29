import { z } from "zod";
import {
  authenticatedProcedure,
  createTRPCRouter,
  shopOwnerProcedure,
} from "../trpc";
import { db } from "@/server/db";
import { catalogProducts, catalog, products, shops } from "@/server/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { catalogForm } from "@/lib/schemas/catalog";
import { nanoid } from "nanoid";

async function ensureUserOwnsCatalog({
  catalogId,
  userId,
}: {
  catalogId: string;
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
        eq(catalog.id, catalogId),
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
        catalogId: z.string().optional(),
      }),
    )
    .input(catalogForm)
    .mutation(async ({ ctx, input }) => {
      const { catalogId, ...data } = input;
      if (catalogId) {
        await ensureUserOwnsCatalog({
          catalogId: catalogId,
          userId: ctx.auth.userId,
        });
      }

      const productIds = await db
        .select({ id: products.id })
        .from(products)
        .where(
          and(
            eq(products.shopId, ctx.shopId),
            inArray(products.id, data.productIds),
          ),
        );

      // ensure all products are owned by this shop
      if (productIds.length !== data.productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const newId = nanoid();

      const maxCatalogsAllowed = 1;

      const [result] = await db
        .select({
          count: sql<number>`cast(count(*) as unsigned)`,
        })
        .from(catalog)
        .where(eq(catalog.shopId, ctx.shopId));

      if (result && result.count >= maxCatalogsAllowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Maximum number of catalogs reached",
        });
      }

      await db.transaction(async (tx) => {
        await tx
          .insert(catalog)
          .values({
            id: catalogId ?? newId,
            name: input.name,
            shopId: ctx.shopId,
          })
          .onDuplicateKeyUpdate({
            set: {
              name: data.name,
            },
          });

        const id = catalogId ?? newId;

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
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      await ensureUserOwnsCatalog({
        userId: ctx.auth.userId,
        catalogId: input,
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
