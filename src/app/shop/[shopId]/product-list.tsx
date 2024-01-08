import { db } from "@/server/db";
import { catalog, catalogProducts, products, shops } from "@/server/db/schema";
import { and, eq, sql, getTableColumns } from "drizzle-orm";
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
    <div>
      {shopProducts.map((product) => (
        <div>
          {product.id} {product.name}
        </div>
      ))}
    </div>
  );
}
