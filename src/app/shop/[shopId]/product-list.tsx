import { db } from "@/server/db";
import { catalog, catalogProducts, products } from "@/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductCard } from "./ProductCard";
import EmptyView from "@/components/ui/empty-view";
import { FrownIcon } from "lucide-react";
import { productDisplayColumns } from "@/server/db/util";

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
      .where(and(eq(catalog.shopId, shopId), eq(catalog.id, catalogId)));

    if (!catalogResult) {
      notFound();
    }

    shopProducts = await db
      .select(productDisplayColumns)
      .from(catalogProducts)
      .innerJoin(products, eq(catalogProducts.productId, products.id))
      .where(
        and(
          eq(catalogProducts.catalogId, catalogId),
          eq(catalogProducts.productId, products.id),
        ),
      );
  } else {
    shopProducts = await db
      .select(productDisplayColumns)
      .from(products)
      .where(eq(products.shopId, shopId));
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {!shopProducts.length && (
        <EmptyView
          title="No products found"
          description="This shop has not added any product yet"
          icon={<FrownIcon size={40} />}
        />
      )}

      {!!shopProducts.length &&
        shopProducts.map((product) => <ProductCard product={product} />)}
    </div>
  );
}
