"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type products } from "@/server/db/schema";
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
      }) => (
        <div>
          <Label {...getLabelProps()}>Select products</Label>
          <Input {...getInputProps()} />

          <ul {...getMenuProps()}>
            {isOpen &&
              products.map((product, index) => (
                <li
                  key={product.id}
                  {...getItemProps({ item: product, index })}
                >
                  {product.id} {product.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </Downshift>
  );
}
