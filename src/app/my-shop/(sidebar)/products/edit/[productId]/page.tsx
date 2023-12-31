import { api } from "@/trpc/server";

export default async function Page({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const product = await api.product.getDetail.query({
    productId: Number(productId),
  });

  return <div>{JSON.stringify(product, null, 2)}</div>;
}
