import { ShoppingBag } from "lucide-react";
import { api } from "@/trpc/server";
import UserSection from "./user-section";
import Link from "next/link";
import SearchBar from "./search-bar";
import logo from "./logo.png";
import Image from "next/image";

export default async function NavBar() {
  const shop = await api.shop.myShop.query();

  return (
    <header className="h-16 w-full items-center border-b border-b-border bg-background">
      <div className="container mx-auto flex h-full items-center justify-between gap-16">
        <Link href={"/"}>
          <span className="flex items-center gap-1 text-primary">
            <Image src={logo} alt="Brand logo" className="h-10 w-10" />
            <span className="text-xl">Kaimono</span>
          </span>
        </Link>

        <SearchBar />

        <nav className="flex gap-5">
          <UserSection shop={shop} />
        </nav>
      </div>
    </header>
  );
}
