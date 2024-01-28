import { productSchema, searchSchema } from "@/lib/schemas/product";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
  shopOwnerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { categories, products, shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import {
  type SQLWrapper,
  and,
  eq,
  getTableColumns,
  like,
  gte,
  lte,
  asc,
  desc,
  or,
  inArray,
} from "drizzle-orm";
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

  search: publicProcedure.input(searchSchema).query(async ({ input, ctx }) => {
    const conditions: SQLWrapper[] = [];

    if (input.keyword) {
      conditions.push(like(products.name, `%${input.keyword}%`));
    }

    if (input.minPrice) {
      conditions.push(gte(products.price, input.minPrice));
    }

    if (input.maxPrice) {
      conditions.push(lte(products.price, input.maxPrice));
    }

    if (input.categoryIds && input.categoryIds.length > 0) {
      conditions.push(inArray(products.categoryId, input.categoryIds));
    }

    if (!!input.new || !!input.used) {
      const orParams: SQLWrapper[] = [];
      if (input.new) {
        orParams.push(eq(products.condition, "new"));
      }

      if (input.used) {
        orParams.push(eq(products.condition, "used"));
      }

      const orCondition = or(...orParams);

      if (orCondition) {
        conditions.push(orCondition);
      }
    }

    let result = ctx.db
      .select()
      .from(products)
      .innerJoin(shops, eq(shops.id, products.shopId))
      .where(and(...conditions));

    if (input.sort) {
      result = result.orderBy(
        input.sort === "p_asc"
          ? asc(products.price)
          : input.sort === "p_desc"
            ? desc(products.price)
            : input.sort === "new"
              ? desc(products.createdAt)
              : asc(products.createdAt),
      );
    }

    const pageSize = 8;
    const pageNumber = input.page ?? 1;
    result = result.limit(pageSize).offset((pageNumber - 1) * pageSize);

    return await result;
  }),
});
