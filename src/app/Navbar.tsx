import { ShoppingBag } from "lucide-react";
import { api } from "@/trpc/server";
import UserSection from "./user-section";

export default async function NavBar() {
  const shop = await api.shop.myShop.query();

  return (
    <header className="flex h-16 items-center self-stretch border-b border-b-border bg-background px-6">
      <span className="flex items-center gap-1 text-primary">
        <ShoppingBag size={32} />
        <span className="text-xl">Happy Commerce</span>
      </span>

      <nav className="ml-auto flex gap-5">
        <UserSection shop={shop} />
      </nav>
    </header>
  );
}
