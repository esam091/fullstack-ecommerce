import { Button } from "@/components/ui/button";
import imageUrl from "@/lib/imageUrl";
import { stringifyColumn } from "@/lib/stringifyColumn";
import { db } from "@/server/db";
import { products, shops } from "@/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Page({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const [result] = await db
    .select({
      product: getTableColumns(products),
      shop: {
        id: shops.id,
        name: shops.name,
        image: shops.image,
        location: shops.location,
      },
    })
    .from(products)
    .innerJoin(shops, eq(products.shopId, shops.id))
    .where(eq(stringifyColumn(products.id), productId));

  if (!result) {
    notFound();
  }

  const { product, shop } = result;

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          {/* Images */}
          <div>
            {/* <img
              src="https://cdn.tailkit.com/media/placeholders/photo-LxVxPA1LOVM-800x600.jpg"
              alt="Product Image"
            /> */}

            <Image
              src={imageUrl(product.image)}
              width={600}
              height={600}
              alt="Product Image"
              className="rounded-sm"
            />
          </div>
          {/* END Images */}

          {/* Product Info */}
          <div>
            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <a
                  href="#"
                  className="block font-semibold hover:text-gray-500 dark:hover:text-gray-300"
                >
                  {product.name}
                </a>
              </div>
            </div>
            <div className="prose prose-indigo dark:prose-invert mb-4">
              <p>
                Maecenas ultrices, justo vel imperdiet gravida, urna ligula
                hendrerit nibh, ac cursus nibh sapien in purus. Mauris tincidunt
                tincidunt turpis in porta. Integer fermentum tincidunt auctor.
              </p>
              <p>
                Consectetur adipiscing elit. Maecenas ultrices, justo vel
                imperdiet gravida, urna ligula hendrerit nibh, ac cursus nibh
                sapien in purus. Mauris tincidunt tincidunt turpis in porta
                integer.
              </p>
              <p>
                Urna ligula hendrerit nibh, ac cursus nibh sapien in purus.
                Mauris tincidunt tincidunt turpis in porta. Integer fermentum
                tincidunt.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xl font-semibold text-gray-600 dark:text-gray-400">
                  ${product.price}
                </div>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
                <Button size={"lg"}>Add to cart</Button>
              </div>
            </div>
          </div>
          {/* END Product Info */}
        </div>
      </div>
    </div>
  );
}
