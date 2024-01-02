"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import imageUrl from "@/lib/imageUrl";
import { type products } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/my-shop/products/${product.id}`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <Button
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
        </Button> */}
      </TableCell>
    </TableRow>
  );
}
