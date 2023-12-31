import { api } from "@/trpc/server";
import AddEditProductForm from "../../add-edit-product-form";
import { notFound } from "next/navigation";

export default async function Page({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const product = await api.product.getDetail.query({
    productId: Number(productId),
  });

  if (!product) {
    notFound();
  }

  return <AddEditProductForm product={product} />;
}
