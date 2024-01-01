"use client";

import { Button } from "@/components/ui/button";
import { type products } from "@/server/db/schema";
import { api } from "@/trpc/react";

type Props = {
  product: typeof products.$inferSelect;
};

export default function ProductRow({ product }: Props) {
  const deleteProduct = api.product.delete.useMutation();

  return (
    <div>
      <div>name: {product.name}</div>
      <Button
        onClick={() =>
          deleteProduct.mutate(
            { productId: product.id },
            {
              onSuccess: () => alert("success"),
              onError: (error) => alert("error " + error.message),
            },
          )
        }
      >
        Delete
      </Button>
    </div>
  );
}
