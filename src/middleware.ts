import { authMiddleware } from "@clerk/nextjs";
import { env } from "./env";

export default authMiddleware({
  publicRoutes: () => true,
  debug: env.NODE_ENV !== "production",
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
