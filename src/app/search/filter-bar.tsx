"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ProductSearchParamsInput,
  type ProductSearchParams,
} from "@/lib/schemas/product";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { type GetCategoriesOutput } from "@/lib/utils";

export default function FilterBar({
  searchParams,
  categories,
}: {
  searchParams: ProductSearchParams;
  categories: GetCategoriesOutput;
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

    if (newSearchParams.new) {
      urlSearchParams.append("n", "1");
    }

    if (newSearchParams.used) {
      urlSearchParams.append("u", "1");
    }

    if (newSearchParams.categoryIds) {
      for (const id of newSearchParams.categoryIds) {
        urlSearchParams.append("c", id);
      }
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
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <Checkbox
                  value="new"
                  defaultChecked={searchParams.new}
                  onCheckedChange={(value) => {
                    if (value === "indeterminate") {
                      return;
                    }

                    updateSearchParams({
                      new: value,
                    });
                  }}
                />
                New
              </label>

              <label className="flex items-center gap-1">
                <Checkbox
                  value="used"
                  defaultChecked={searchParams.used}
                  onCheckedChange={(value) => {
                    if (value === "indeterminate") {
                      return;
                    }

                    updateSearchParams({
                      used: value,
                    });
                  }}
                />
                Used
              </label>
            </div>

            <div>
              <Label>Categories</Label>
              <div>
                {categories.map((category) => (
                  <div key={category.id}>
                    <label>
                      <Checkbox
                        value={category.id}
                        checked={
                          searchParams.categoryIds?.includes(category.id) ??
                          false
                        }
                        onCheckedChange={(value) => {
                          if (value === "indeterminate") {
                            return;
                          }

                          let categoryIds = searchParams.categoryIds ?? [];

                          if (value) {
                            categoryIds = [...categoryIds, category.id];
                          } else {
                            categoryIds = categoryIds.filter(
                              (id) => id !== category.id,
                            );
                          }

                          updateSearchParams({
                            categoryIds,
                          });
                        }}
                      />{" "}
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </aside>
  );
}
