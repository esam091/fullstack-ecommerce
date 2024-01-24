import { api } from "@/trpc/server";
import AddEditProductForm from "../add-edit-product-form";

export default async function Page() {
  const categories = await api.product.getCategories.query();
  return <AddEditProductForm categories={categories} />;
}
