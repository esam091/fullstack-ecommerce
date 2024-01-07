import { type PropsWithChildren } from "react";
import SidebarLink from "./sidebar-link";
import { db } from "@/server/db";
import { shops } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Layout(props: PropsWithChildren) {
  const userId = auth().userId;
  if (!userId) {
    redirect("https://active-gannet-19.accounts.dev/sign-in");
  }

  const result = await db
    .select({ id: shops.id })
    .from(shops)
    .where(eq(shops.userId, userId));

  if (!result.length) {
    redirect("/my-shop/create");
  }

  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">My Shop</h2>
        <p className="text-muted-foreground">Manage your shop and products</p>
      </div>

      <div className="my-6 h-[1px] w-full shrink-0 bg-border"></div>

      <div className="flex space-x-12 space-y-0">
        <aside className="-mx-4 w-1/5">
          <nav className="flex flex-col ">
            <SidebarLink href="/my-shop/profile">Profile</SidebarLink>
            <SidebarLink href="/my-shop/product">Products</SidebarLink>
            <SidebarLink href="/my-shop/catalog">Collections</SidebarLink>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{props.children}</div>
      </div>
    </div>
  );
}
