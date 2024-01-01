import { api } from "@/trpc/server";
import ProductRow from "./product-row";

export default async function Page() {
  const products = await api.product.myProducts.query();
  return (
    <div>
      {products.map((product) => (
        <ProductRow product={product} key={product.id} />
      ))}
    </div>
  );
}
