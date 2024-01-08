import imageUrl from "@/lib/imageUrl";
import { db } from "@/server/db";
import { catalog, catalogProducts, products, shops } from "@/server/db/schema";
import { and, eq, sql, getTableColumns } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

function stringifyColumn<T>(column: T) {
  return sql<string>`CAST(${column} as char)`;
}

export default async function ProductList({
  shopId,
  catalogId,
}: {
  shopId: string;
  catalogId?: string;
}) {
  let shopProducts: Array<typeof products.$inferSelect>;

  if (catalogId) {
    const [catalogResult] = await db
      .select({
        a: sql`1`,
      })
      .from(catalog)
      .where(
        and(
          eq(stringifyColumn(catalog.shopId), shopId),
          eq(stringifyColumn(catalog.id), catalogId),
        ),
      );

    if (!catalogResult) {
      notFound();
    }

    shopProducts = await db
      .select({
        ...getTableColumns(products),
      })
      .from(catalogProducts)
      .innerJoin(products, eq(catalogProducts.productId, products.id))
      .where(
        and(
          eq(stringifyColumn(catalogProducts.catalogId), catalogId),
          eq(catalogProducts.productId, products.id),
        ),
      );
  } else {
    shopProducts = await db
      .select()
      .from(products)
      .where(eq(sql<string>`CAST(${products.shopId} as char)`, shopId));
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {shopProducts.map((product) => (
        <div className="group relative overflow-hidden rounded-lg shadow-lg">
          <Link className="absolute inset-0 z-10" href="#">
            <span className="sr-only">View</span>
          </Link>
          <Image
            alt="Product 1"
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
      ))}
    </div>
  );
}
