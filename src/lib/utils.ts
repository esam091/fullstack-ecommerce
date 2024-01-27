import { type AppRouter } from "@/server/api/root";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type Procedures = keyof AppRouter["_def"]["procedures"];

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type MyShopOutput = RouterOutput["shop"]["myShop"];
export type GetCategoriesOutput = RouterOutput["product"]["getCategories"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
