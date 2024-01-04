import { db } from "@/server/db";
import { catalog, catalogProducts, products } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import CatalogAddEditForm from "../../add-edit-form";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Page({
  params: { catalogId },
}: {
  params: { catalogId: string };
}) {
  const result = await db.query.catalog.findFirst({
    where: eq(catalog.id, Number(catalogId)),
    with: {
      products: true,
    },
  });

  if (!result) {
    notFound();
  }

  const myProducts = await api.product.myProducts.query();

  return (
    <CatalogAddEditForm
      catalog={{
        name: result.name,
        productIds: result.products.map((product) => product.productId),
      }}
      products={myProducts}
    />
  );
}
