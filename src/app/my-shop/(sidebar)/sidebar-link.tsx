"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";

type SidebarLinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function SidebarLink({ href, children }: SidebarLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx(
        "h-9 whitespace-nowrap rounded-md px-4 py-2 text-secondary-foreground",
        pathname.includes(href) ? "bg-clover-300" : "hover:underline",
      )}
    >
      {children}
    </Link>
  );
}
