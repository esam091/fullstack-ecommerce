import { stringifyColumn } from "@/lib/stringifyColumn";
import { db } from "@/server/db";
import { products, shops } from "@/server/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
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

  return <div>product {result.product.name}</div>;
}
