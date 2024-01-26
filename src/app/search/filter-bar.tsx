"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ProductSearchParamsInput,
  type ProductSearchParams,
} from "@/lib/schemas/product";
import { useRouter } from "next/navigation";
import formAction from "./action";
import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function FilterBar({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  const router = useRouter();

  function updateSearchParams(changedParams: ProductSearchParamsInput) {
    const newSearchParams = {
      ...searchParams,
      ...changedParams,
    };

    // console.log("new params", newSearchParams);
    const urlSearchParams = new URLSearchParams();

    if (newSearchParams.keyword) {
      urlSearchParams.append("q", newSearchParams.keyword);
    }

    if (newSearchParams.minPrice) {
      urlSearchParams.append("min", String(newSearchParams.minPrice));
    }

    if (newSearchParams.maxPrice) {
      urlSearchParams.append("max", String(newSearchParams.maxPrice));
    }

    if (newSearchParams.condition) {
      urlSearchParams.append("c", String(newSearchParams.condition));
    }

    if (newSearchParams.categoryId) {
      urlSearchParams.append("cat", newSearchParams.categoryId);
    }

    router.push(`search?${urlSearchParams.toString()}`);
  }

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="col-span-1 pb-12">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Filters
          </h2>
          <form
            id="filter-form"
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();

              updateSearchParams({
                minPrice: minRef.current?.value,
                maxPrice: maxRef.current?.value,
              });
            }}
          >
            <button type="submit" className="hidden">
              submit
            </button>
            <Label>
              Minimum Price{" "}
              <Input
                ref={minRef}
                defaultValue={searchParams.minPrice?.toString()}
              />
            </Label>

            <Label>
              Maximum Price{" "}
              <Input
                ref={maxRef}
                defaultValue={searchParams.maxPrice?.toString()}
              />
            </Label>

            <Label>Condition</Label>
            <div className="flex">
              <Label>
                <Checkbox
                  value="new"
                  onCheckedChange={(e) => {
                    if (e === "indeterminate") {
                      return;
                    }

                    updateSearchParams({
                      condition: e ? "new" : undefined,
                    });
                  }}
                ></Checkbox>
                New
              </Label>
              <Checkbox value="used">Used</Checkbox>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
}
