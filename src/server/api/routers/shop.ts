import { shopSchema } from "@/lib/schemas/shop";
import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { shops } from "@/server/db/schema";
import validateTurnstile from "@/server/validate-turnstile";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import z from "zod";

export const shopRouter = createTRPCRouter({
  myShop: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.userId) {
      return null;
    }

    const result = await ctx.db
      .select()
      .from(shops)
      .where(eq(shops.userId, ctx.auth.userId));

    return result[0];
  }),

  createOrUpdate: authenticatedProcedure
    .input(shopSchema)
    .mutation(async ({ input, ctx }) => {
      const { turnstileToken } = input;

      const passesTurnstile = await validateTurnstile(turnstileToken);
      if (!passesTurnstile) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Failed bot detection",
        });
      }

      await ctx.db
        .insert(shops)
        .values({
          userId: ctx.auth.userId,
          name: input.name,
          image: input.image,
          location: input.location,
        })
        .onDuplicateKeyUpdate({
          set: {
            name: input.name,
            location: input.location,
            image: input.image,
          },
        });
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    return ctx.db.query.shops.findFirst({
      where: eq(sql<string>`CAST(${shops.id} as char)`, input),
      with: {
        catalogs: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),
});
