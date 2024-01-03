"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent } from "@/components/ui/popover";
import imageUrl from "@/lib/imageUrl";
import { type products } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { PopoverAnchor } from "@radix-ui/react-popover";
import clsx from "clsx";
import { useCombobox, useMultipleSelection } from "downshift";
import Image from "next/image";
import React, { useState } from "react";

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
  const [inputValue, setInputValue] = useState("");
  const {
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    addSelectedItem,
  } = useMultipleSelection({});

  const filteredProducts = products.filter(
    (product) =>
      !!inputValue &&
      product.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const {
    getLabelProps,
    getInputProps,
    isOpen,
    getMenuProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    inputValue,
    selectedItem: null,
    items: filteredProducts,
    itemToString: (product) => product?.name ?? "",
    onSelectedItemChange({ selectedItem: newSelectedItem }) {
      if (newSelectedItem) {
        if (selectedItems.includes(newSelectedItem)) {
          removeSelectedItem(newSelectedItem);
        } else {
          addSelectedItem(newSelectedItem);
        }
      }
    },
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep the menu open after selection.
          };
        default:
          return changes;
      }
    },
    onStateChange({ inputValue: newInputValue, type }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue ?? "");

          break;
        default:
          break;
      }
    },
  });

  return (
    <div>
      <Label {...getLabelProps()}>Select products</Label>
      <Input
        {...getInputProps(
          getDropdownProps({
            preventKeyAction: true,
          }),
        )}
      />

      <Popover open={isOpen}>
        <PopoverAnchor />
        <PopoverContent
          className="p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ul {...getMenuProps({}, { suppressRefError: true })}>
            {filteredProducts.map((product, index) => (
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

                <div className="flex-1">
                  <div className="font-semibold">
                    {product.name} {index}
                  </div>
                  <div className="text-sm">$ {product.price}</div>
                </div>

                <Checkbox checked={selectedItems.includes(product)} />
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
