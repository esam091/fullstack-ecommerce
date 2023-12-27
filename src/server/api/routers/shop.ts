import {
  authenticatedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const shopRouter = createTRPCRouter({
  createShop: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        location: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const existingShop = await ctx.db
        .select({
          userId: shops.userId,
        })
        .from(shops)
        .where(eq(shops.userId, ctx.auth.userId));

      if (existingShop.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "User already has a shop",
        });
      }
      const newShop = await ctx.db.insert(shops).values({
        userId: ctx.auth.userId,
        name: input.name,
        image: input.image,
        location: input.location,
      });

      return newShop;
    }),
});
