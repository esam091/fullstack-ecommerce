import { ShoppingBag } from "lucide-react";
import { api } from "@/trpc/server";
import UserSection from "./user-section";
import Link from "next/link";

export default async function NavBar() {
  const shop = await api.shop.myShop.query();

  return (
    <header className="h-16 w-full items-center border-b border-b-border bg-background">
      <div className="container mx-auto flex h-full items-center">
        <Link href={"/"}>
          <span className="flex items-center gap-1 text-primary">
            <ShoppingBag size={32} />
            <span className="text-xl">Happy Commerce</span>
          </span>
        </Link>

        <nav className="ml-auto flex gap-5">
          <UserSection shop={shop} />
        </nav>
      </div>
    </header>
  );
}
