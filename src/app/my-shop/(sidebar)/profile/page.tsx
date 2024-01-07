import { api } from "@/trpc/server";
import ShopAddEditForm from "../../create/add-edit-form";

export default async function Page() {
  const shop = await api.shop.myShop.query();

  return <ShopAddEditForm shop={shop} />;
}
