"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

import { Store } from "lucide-react";
import SignOut from "./sign-out";

import { type MyShopOutput } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

export default function UserSection({ shop }: { shop: MyShopOutput }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-5 w-24 rounded-full" />;
  }

  if (!user) {
    return (
      <>
        <Button asChild variant={"secondary"}>
          <SignInButton />
        </Button>

        <Button asChild>
          <SignUpButton />
        </Button>
      </>
    );
  }

  return (
    <>
      {!!shop ? (
        <Button size={"sm"} variant={"secondary"} asChild>
          <Link href={"/my-shop"}>
            <Store className="mr-2" /> My Shop
          </Link>
        </Button>
      ) : (
        <Button size={"sm"} asChild>
          <Link href={"/my-shop/create"}>
            <Store className="mr-2" /> Create Shop
          </Link>
        </Button>
      )}
      <UserButton />
      <SignOut />
    </>
  );
}
