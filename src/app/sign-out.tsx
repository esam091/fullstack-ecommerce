"use client";

import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  return (
    <Button asChild variant={"ghost"}>
      <SignOutButton signOutCallback={() => router.push("/")} />
    </Button>
  );
}
