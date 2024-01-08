import { db } from "@/server/db";
import { products } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function ProductList({
  shopId,
  catalogId,
}: {
  shopId: string;
  catalogId?: string;
}) {
  const shopProducts = await db
    .select()
    .from(products)
    .where(eq(sql<string>`CAST(${products.shopId} as char)`, shopId));

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
