import { api } from "@/trpc/server";
import CatalogForm from "../add-edit-form";

export default async function Page() {
  const products = await api.product.myProducts.query();

  return <CatalogForm products={products} />;
}
