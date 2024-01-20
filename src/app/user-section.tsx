"use client";

import { Button } from "@/components/ui/button";
import { SignIn, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

import { Store } from "lucide-react";
import SignOut from "./sign-out";

import { type MyShopOutput } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserSection({ shop }: { shop: MyShopOutput }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-5 w-24 rounded-full" />;
  }

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Sign In</Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent
            showBackground={false}
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          >
            <SignIn />
          </DialogContent>
        </DialogPortal>
      </Dialog>
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
