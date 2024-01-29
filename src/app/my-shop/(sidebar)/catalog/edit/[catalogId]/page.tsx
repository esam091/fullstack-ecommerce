import { db } from "@/server/db";
import { catalog } from "@/server/db/schema";
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
    columns: {
      id: true,
      name: true,
    },
    where: eq(catalog.id, catalogId),
    with: {
      products: {
        columns: {
          productId: true,
        },
      },
    },
  });

  if (!result) {
    notFound();
  }

  const myProducts = await api.product.myProducts.query();

  return (
    <CatalogAddEditForm
      catalog={{
        id: result.id,
        name: result.name,
        productIds: result.products.map((product) => product.productId),
      }}
      products={myProducts}
    />
  );
}
