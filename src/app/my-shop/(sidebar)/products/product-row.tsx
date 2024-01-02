"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  product: typeof products.$inferSelect;
};

export default function ProductRow({ product }: Props) {
  const deleteProduct = api.product.delete.useMutation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
              <Link href={`/my-shop/products/${product.id}`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              The product will be deleted permanently. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              asChild
              className={buttonVariants({ variant: "destructive" })}
            >
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
                Continue
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TableRow>
  );
}
