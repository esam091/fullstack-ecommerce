import imageUrl from "@/lib/imageUrl";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SidebarLink from "@/app/my-shop/(sidebar)/sidebar-link";
import ProductList from "./product-list";

export default async function Page({
  params: { shopId },
}: {
  params: { shopId: string };
}) {
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

        <div className="flex-1 lg:max-w-2xl">
          <ProductList shopId={shopId} />
        </div>
      </div>
    </div>
  );
}
