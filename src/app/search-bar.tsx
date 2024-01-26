"use client";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const inputDefaultValue = pathname === "/search" ? searchParams.get("q") : "";

  return (
    <form
      id="search-form"
      className="flex-1"
      onSubmit={(event) => {
        event.preventDefault();

        if (inputRef.current?.value) {
          router.push(`/search?q=${inputRef.current.value.trim()}`);
        }
      }}
    >
      <Input
        className="w-full"
        placeholder="Search Products"
        ref={inputRef}
        defaultValue={inputDefaultValue ?? ""}
      />
    </form>
  );
}
