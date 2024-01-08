import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { type PropsWithChildren } from "react";
import imageUrl from "@/lib/imageUrl";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SidebarLink from "@/app/my-shop/(sidebar)/sidebar-link";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{
  params: {
    shopId: string;
  };
}>) {
  const { shopId } = params;

  const shop = await api.shop.getById.query(shopId);

  if (!shop) {
    notFound();
  }

  return (
    <div>
      <div className="flex gap-5">
        <Image
          src={imageUrl(shop.image)}
          width={60}
          height={60}
          className="rounded-full"
          alt="Shop image"
        />
        <div>
          <h2 className="text-2xl font-bold">{shop.name}</h2>
          <div className="text-muted-foreground">{shop.location}</div>
        </div>
      </div>
      <Separator className="my-6" />

      <div className="flex space-x-12 space-y-0">
        <aside className="-mx-4 w-1/5">
          <nav className="flex flex-col">
            <SidebarLink href={`/shop/${shopId}`}>All Products</SidebarLink>
            {shop.catalogs.map((catalog) => (
              <SidebarLink href={`/shop/${shopId}/catalog/${catalog.id}`}>
                {catalog.name}
              </SidebarLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
