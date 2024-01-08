import ProductList from "./product-list";

export default async function Page({
  params: { shopId },
}: {
  params: { shopId: string };
}) {
  return <ProductList shopId={shopId} />;
}
