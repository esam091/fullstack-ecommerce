import { productSchema, searchSchema } from "@/lib/schemas/product";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
  shopOwnerProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { categories, products, shops } from "@/server/db/schema";
import validateTurnstile from "@/server/validate-turnstile";
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
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { productDisplayColumns } from "@/server/db/util";

const productIdInput = z.object({
  productId: z.string(),
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
    .input(z.object({ productId: z.string().optional() }))
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
      } else {
        const [result] = await db
          .select({
            count: sql<number>`count(*)`,
          })
          .from(products)
          .where(eq(products.shopId, ctx.shopId));

        if (!result) {
          // if not found then the query must be wrong
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const maxProducts = 30;

        if (result.count >= maxProducts) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Cannot have more than ${maxProducts} products`,
          });
        }
      }

      const { productId, turnstileToken, price: priceNumber, ...data } = input;

      const passesTurnstile = await validateTurnstile(turnstileToken);
      if (!passesTurnstile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Failed bot detection",
        });
      }

      const price = sql`round(${priceNumber * 100}, 0)::int`;
      await db
        .insert(products)
        .values({
          ...data,
          id: productId ?? nanoid(),
          shopId: ctx.shopId,
          price,
        })
        .onConflictDoUpdate({
          target: products.id,
          set: {
            ...data,
            price,
          },
        });
    }),

  delete: ownProductProcedure.mutation(async ({ input }) => {
    await db.delete(products).where(eq(products.id, input.productId));
  }),

  myProducts: shopOwnerProcedure.query(async ({ ctx }) => {
    return await db
      .select(productDisplayColumns)
      .from(products)
      .where(eq(products.shopId, ctx.shopId));
  }),

  getDetail: publicProcedure
    .input(productIdInput)
    .input(z.object({ onlyMine: z.boolean().optional() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.db
        .select({
          product: productDisplayColumns,
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

    const pageSize = 8;

    let result = ctx.db
      .select({
        product: productDisplayColumns,
        shop: getTableColumns(shops),
      })
      .from(products)
      .innerJoin(shops, eq(shops.id, products.shopId))
      .where(and(...conditions));

    const cnt = ctx.db
      .select({
        rowCount: sql<number>`count(*) / ${pageSize}`,
      })
      .from(products)
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

    const pageNumber = input.page ?? 1;
    result = result.limit(pageSize).offset((pageNumber - 1) * pageSize);

    return {
      rows: await result,
      pageCount: (await cnt)[0]?.rowCount ?? 0,
    };
  }),
});
