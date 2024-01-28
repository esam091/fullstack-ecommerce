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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import buildSearchParam from "./params";

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

    router.push(`search?${buildSearchParam(newSearchParams).toString()}`);
  }

  const minRef = useRef<HTMLInputElement>(null);
  const maxRef = useRef<HTMLInputElement>(null);

  return (
    <aside className="col-span-1 pb-12">
      <div className="space-y-4 py-4">
        <div>
          <div className="flex items-baseline gap-1">
            <h2 className="mb-2 text-lg font-semibold tracking-tight">Sort</h2>

            {!!searchParams.sort && (
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  updateSearchParams({
                    sort: null,
                  })
                }
              >
                clear
              </Button>
            )}
          </div>

          <Select
            value={searchParams.sort ?? ""}
            onValueChange={(value) =>
              updateSearchParams({
                sort: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p_asc">Cheapest Price</SelectItem>
              <SelectItem value="p_desc">Most Expensive</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
              <SelectItem value="old">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="py-2">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Filters</h2>
          <form
            id="filter-form"
            className="space-y-3"
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

            <Label className="flex flex-col gap-1">
              Minimum Price{" "}
              <Input
                ref={minRef}
                defaultValue={searchParams.minPrice?.toString()}
              />
            </Label>

            <Label className="flex flex-col gap-1">
              Maximum Price{" "}
              <Input
                ref={maxRef}
                defaultValue={searchParams.maxPrice?.toString()}
              />
            </Label>

            <div>
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
