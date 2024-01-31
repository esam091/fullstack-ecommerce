import { api } from "@/trpc/server";
import { cache, type PropsWithChildren } from "react";
import imageUrl from "@/lib/imageUrl";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SidebarLink from "@/app/my-shop/(sidebar)/sidebar-link";
import EmptyView from "@/components/ui/empty-view";
import { type Metadata } from "next";

type PageParams = {
  params: {
    shopId: string;
  };
};

const getShopById = cache((shopId: string) => {
  return api.shop.getById.query(shopId);
});

export async function generateMetadata({
  params: { shopId },
}: PageParams): Promise<Metadata> {
  const shop = await getShopById(shopId);

  return {
    title: shop?.name ?? "",
  };
}

export default async function Layout({
  children,
  params,
}: PropsWithChildren<PageParams>) {
  const { shopId } = params;

  const shop = await getShopById(shopId);

  if (!shop) {
    return (
      <EmptyView
        title="Shop not found"
        action={{
          href: "/",
          title: "Back to home",
        }}
      />
    );
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
