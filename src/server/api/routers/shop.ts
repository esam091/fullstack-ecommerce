import { authenticatedProcedure, createTRPCRouter } from "@/server/api/trpc";
import { shops } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const shopRouter = createTRPCRouter({
  myShop: authenticatedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(shops)
      .where(eq(shops.userId, ctx.auth.userId));

    return result[0];
  }),

  createOrUpdate: authenticatedProcedure
    .input(
      z.object({
        name: z.string(),
        image: z.string(),
        location: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
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
});
