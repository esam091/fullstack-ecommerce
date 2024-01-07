import { api } from "@/trpc/server";
import ShopAddEditForm from "./add-edit-form";
import { redirect } from "next/navigation";

export default async function Page() {
  const myShop = await api.shop.myShop.query();

  if (myShop) {
    redirect("/my-shop");
  }

  return (
    <div className="flex justify-center">
      <ShopAddEditForm />
    </div>
  );
}
