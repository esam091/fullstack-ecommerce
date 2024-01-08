import ProductList from "../../product-list";

export default async function Page({
  params: { shopId, catalogId },
}: {
  params: { shopId: string; catalogId: string };
}) {
  return <ProductList shopId={shopId} catalogId={catalogId} />;
}
