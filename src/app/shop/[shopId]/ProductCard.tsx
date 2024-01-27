import imageUrl from "@/lib/imageUrl";
import { type shops, type products } from "@/server/db/schema";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({
  product,
  shop,
}: {
  product: typeof products.$inferSelect;
  shop?: typeof shops.$inferSelect;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg">
      <div className="relative">
        <Link className="absolute inset-0 z-10" href={`/product/${product.id}`}>
          <span className="sr-only">View</span>
        </Link>
        <Image
          alt={`Image of ${product.name}`}
          className="aspect-square h-48 w-full object-cover"
          height={200}
          src={imageUrl(product.image)}
          width={280}
        />
        <div className="bg-white p-4 dark:bg-gray-950">
          <h3 className="text-base">{product.name}</h3>

          <h4 className="text-base font-semibold md:text-lg">
            ${product.price}
          </h4>
        </div>
      </div>

      {!!shop && (
        <Link href={`/shop/${product.shopId}`}>
          <div className="flex p-4">
            <Image
              width={40}
              height={40}
              src={imageUrl(shop.image)}
              alt="Shop picture"
              className="mr-3 aspect-square rounded-sm object-cover"
            />

            <div>
              <p className="font-semibold">{shop.name}</p>
              <p className="text-muted-foreground">{shop.location}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
