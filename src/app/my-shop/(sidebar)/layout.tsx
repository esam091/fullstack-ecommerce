import { type PropsWithChildren } from "react";
import SidebarLink from "./sidebar-link";
import { db } from "@/server/db";
import { shops } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import Link from "next/link";
import { SIGN_IN_URL } from "@clerk/nextjs/server";

export default async function Layout(props: PropsWithChildren) {
  const userId = auth().userId;
  if (!userId) {
    redirect(SIGN_IN_URL);
  }

  const [shop] = await db
    .select({ id: shops.id })
    .from(shops)
    .where(eq(shops.userId, userId));

  if (!shop) {
    redirect("/my-shop/create");
  }

  return (
    <div>
      <div className="space-y-0.5">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-bold tracking-tight">My Shop</h2>
        </div>
        <p className="text-muted-foreground">Manage your shop and products</p>
        <Button asChild variant={"link"} size={"sm"}>
          <Link href={`/shop/${shop.id}`} className="inline-flex gap-1">
            <LinkIcon size={15} />
            See my page
          </Link>
        </Button>
      </div>

      <div className="my-6 h-[1px] w-full shrink-0 bg-border"></div>

      <div className="flex space-x-12 space-y-0">
        <aside className="-mx-4 w-1/5">
          <nav className="flex flex-col ">
            <SidebarLink href="/my-shop/profile">Profile</SidebarLink>
            <SidebarLink href="/my-shop/products">Products</SidebarLink>
            <SidebarLink href="/my-shop/catalog">Catalogs</SidebarLink>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{props.children}</div>
      </div>
    </div>
  );
}
