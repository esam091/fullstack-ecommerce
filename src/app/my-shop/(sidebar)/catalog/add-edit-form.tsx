"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import imageUrl from "@/lib/imageUrl";
import { type products } from "@/server/db/schema";
import { PopoverAnchor } from "@radix-ui/react-popover";
import clsx from "clsx";
import Downshift, { useCombobox } from "downshift";
import Image from "next/image";
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
  const {
    getLabelProps,
    getInputProps,
    isOpen,
    getMenuProps,
    getItemProps,

    inputValue,
    highlightedIndex,
    reset,
  } = useCombobox({
    items: products,
    onSelectedItemChange(changes) {
      alert("change");
      reset();
    },
  });

  return (
    <div>
      <Label {...getLabelProps()}>Select products</Label>
      <Input {...getInputProps()} />

      <Popover open={isOpen} {...getMenuProps()}>
        <PopoverAnchor />
        <PopoverContent
          className="p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ul {...getMenuProps({}, { suppressRefError: true })}>
            {products
              .filter(
                (product) =>
                  !!inputValue &&
                  product.name.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((product, index) => (
                <li
                  key={product.id}
                  {...getItemProps({ item: product, index })}
                  className={clsx(
                    "flex cursor-pointer items-center p-4",
                    highlightedIndex === index && "bg-muted",
                  )}
                >
                  <Image
                    alt={`Image of ${product.name}`}
                    className="mr-3 rounded-md"
                    width={50}
                    height={50}
                    src={imageUrl(product.image)}
                  />

                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm">$ {product.price}</div>
                  </div>
                </li>
              ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
