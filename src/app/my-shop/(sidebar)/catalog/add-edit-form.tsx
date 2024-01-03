"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type products } from "@/server/db/schema";
import { PopoverAnchor } from "@radix-ui/react-popover";
import clsx from "clsx";
import Downshift from "downshift";
import { useId } from "react";

type Props = {
  products: Array<typeof products.$inferSelect>;
};

export default function CatalogForm({ products }: Props) {
  return (
    <div>
      <div>catalog form</div>

      <ProductAutocomplete products={products} />
    </div>
  );
}

type Product = typeof products.$inferSelect;

type ProductAutocompleteProps = {
  products: Product[];
};

function ProductAutocomplete({ products }: ProductAutocompleteProps) {
  return (
    <Downshift<Product>
      onChange={() => alert("clicked")}
      itemToString={(product) => product?.name ?? ""}
    >
      {({
        getLabelProps,
        getInputProps,
        isOpen,
        getMenuProps,
        getItemProps,
        getRootProps,
        inputValue,
        highlightedIndex,
      }) => (
        <div
          {...getRootProps({}, { suppressRefError: true })}
          className="bg-slate-500"
        >
          <Label {...getLabelProps()}>Select products</Label>
          <Input {...getInputProps()} />

          <Popover open={isOpen} {...getMenuProps()}>
            <PopoverAnchor />
            <PopoverContent
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <ul {...getMenuProps({}, { suppressRefError: true })}>
                {products
                  .filter(
                    (product) =>
                      !!inputValue &&
                      product.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()),
                  )
                  .map((product, index) => (
                    <li
                      key={product.id}
                      {...getItemProps({ item: product, index })}
                      className={clsx(
                        highlightedIndex === index && "bg-orange-200",
                      )}
                    >
                      {product.id} {product.name}
                    </li>
                  ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </Downshift>
  );
}
