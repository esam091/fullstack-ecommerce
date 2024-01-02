import { api } from "@/trpc/server";
import ProductRow from "./product-row";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  const products = await api.product.myProducts.query();

  if (products.length === 0) {
    return (
      <div>
        <h2>No products found</h2>

        <p>Add your first product and start selling</p>

        <Button asChild>
          <Link href={"/my-shop/products/add"}>Add Product</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {products.map((product) => (
        <ProductRow product={product} key={product.id} />
      ))}
    </div>
  );
}
