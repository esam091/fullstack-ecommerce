import { type PropsWithChildren } from "react";
import SidebarLink from "./sidebar-link";

export default function Layout(props: PropsWithChildren) {
  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">My Shop</h2>
        <p className="text-muted-foreground">Manage your shop and products</p>
      </div>

      <div className="my-6 h-[1px] w-full shrink-0 bg-border"></div>

      <div className="flex space-x-12 space-y-0">
        <aside className="-mx-4 w-1/5">
          <nav className="flex flex-col ">
            <SidebarLink href="/my-shop/profile">Profile</SidebarLink>
            <SidebarLink href="/my-shop">Products</SidebarLink>
            <SidebarLink href="/my-shop/collections">Collections</SidebarLink>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">{props.children}</div>
      </div>
    </div>
  );
}
