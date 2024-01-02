"use client";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import imageUrl from "@/lib/imageUrl";
import { type products } from "@/server/db/schema";
import { api } from "@/trpc/react";
import Image from "next/image";

type Props = {
  product: typeof products.$inferSelect;
};

export default function ProductRow({ product }: Props) {
  const deleteProduct = api.product.delete.useMutation();

  return (
    <TableRow>
      <TableCell className="text-md flex items-center gap-2 font-semibold">
        <Image
          alt={`Image for ${product.name}`}
          className="rounded-md"
          width={60}
          height={60}
          src={imageUrl(product.image)}
        />{" "}
        {product.name}
      </TableCell>
      <TableCell>{product.description}</TableCell>
      <TableCell>$ {product.price}</TableCell>
      <TableCell>
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
      </TableCell>
    </TableRow>
  );
}
