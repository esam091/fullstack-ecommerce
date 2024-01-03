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
import Downshift, { useCombobox, useMultipleSelection } from "downshift";
import Image from "next/image";
import { useId, useState } from "react";

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
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    addSelectedItem,
  } = useMultipleSelection({});

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
    onStateChange({ type, selectedItem: newSelectedItem }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            console.log("new item", newSelectedItem.id, newSelectedItem.name);
            if (selectedItems.includes(newSelectedItem)) {
              removeSelectedItem(newSelectedItem);
            } else {
              addSelectedItem(newSelectedItem);
            }
          }
          console.log("type", type);
          reset();
        default:
          break;
      }
    },
  });

  return (
    <div>
      <div>{JSON.stringify(selectedItems)}</div>
      <Label {...getLabelProps()}>Select products</Label>
      <Input
        {...getInputProps(
          getDropdownProps({
            preventKeyAction: true,
          }),
        )}
      />

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
