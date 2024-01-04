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
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CatalogFormSchema, catalogForm } from "@/lib/schemas/catalog";
import { Form } from "@/components/ui/form";
import FormTextField from "@/components/ui/form-textfield";
import { Table, X } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props = {
  products: Array<typeof products.$inferSelect>;
};

export default function CatalogAddEditForm({ products }: Props) {
  const form = useForm<CatalogFormSchema>({
    resolver: zodResolver(catalogForm),
    defaultValues: {
      productIds: [],
    },
  });

  const { control, setValue } = form;

  return (
    <Form {...form}>
      <form>
        <FormTextField control={control} name="name" label="Catalog Name" />

        <ProductAutocomplete
          products={products}
          onSelectedProductsChange={(selectedProducts) =>
            setValue(
              "productIds",
              selectedProducts.map((product) => product.id),
            )
          }
        />

        <SelectedProducts products={products} />
      </form>
    </Form>
  );
}

function SelectedProducts({ products }: { products: Product[] }) {
  const { watch, setValue } = useFormContext<CatalogFormSchema>();

  const productIDs = watch("productIds");
  const map = useMemo(() => {
    const record: Record<number, Product> = {};

    for (const product of products) {
      record[product.id] = product;
    }

    return record;
  }, [products]);

  return (
    <div className="space-y-3">
      {!!productIDs.length &&
        productIDs.map((id, index) => {
          const product = map[id]!;

          return (
            <div key={id} className="flex max-w-md items-center gap-2">
              <Image
                src={imageUrl(product.image)}
                width={60}
                height={60}
                alt={`Image of ${product.name}`}
                className="rounded-md"
              />

              <div className="flex-1">
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>

              <Button
                size={"icon"}
                variant={"ghost"}
                type="button"
                onClick={() =>
                  setValue(
                    "productIds",
                    productIDs.filter((productId) => productId !== id),
                  )
                }
              >
                <X />
              </Button>
            </div>
          );
        })}
    </div>
  );
}

type Product = typeof products.$inferSelect;

type ProductAutocompleteProps = {
  products: Product[];
  onSelectedProductsChange?(products: Product[]): void;
};

function ProductAutocomplete({
  products,
  onSelectedProductsChange,
}: ProductAutocompleteProps) {
  const { watch, setValue } = useFormContext<CatalogFormSchema>();

  const selectedIds = watch("productIds");
  const set = new Set(selectedIds);

  const selectedProducts = products.filter((product) => set.has(product.id));

  const [inputValue, setInputValue] = useState("");
  const { getDropdownProps, selectedItems } = useMultipleSelection<Product>({
    selectedItems: selectedProducts,
    onSelectedItemsChange({ selectedItems }) {
      if (selectedItems) {
        onSelectedProductsChange?.(selectedItems);
      }
    },
  });

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
        if (set.has(newSelectedItem.id)) {
          setValue(
            "productIds",
            selectedIds.filter((id) => id !== newSelectedItem.id),
          );
        } else {
          setValue("productIds", [...selectedIds, newSelectedItem.id]);
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
    <div className="space-y-2">
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
                  width={60}
                  height={60}
                  src={imageUrl(product.image)}
                />

                <div className="flex-1">
                  <div className="font-semibold">{product.name}</div>
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
