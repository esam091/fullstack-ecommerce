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
import React, { useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type CatalogFormSchema, catalogForm } from "@/lib/schemas/catalog";
import { Form, FormError } from "@/components/ui/form";
import FormTextField from "@/components/ui/form-textfield";
import { X } from "lucide-react";
import { Button, LoadingButton, buttonVariants } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type Props = {
  products: Array<typeof products.$inferSelect>;
  catalog?: CatalogFormSchema & { id: number };
};

export default function CatalogAddEditForm({ products, catalog }: Props) {
  const form = useForm<CatalogFormSchema>({
    resolver: zodResolver(catalogForm),
    defaultValues: {
      productIds: catalog?.productIds ?? [],
      name: catalog?.name,
    },
  });

  const toast = useToast();

  const { control, setValue, handleSubmit } = form;

  const { mutate: submit, isLoading: isSubmitting } =
    api.catalog.createOrUpdate.useMutation();

  const { mutate: deleteCatalog, isLoading: isDeleting } =
    api.catalog.delete.useMutation();

  const router = useRouter();

  const isLoading = isSubmitting || isDeleting;

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        onSubmit={handleSubmit((data) => {
          submit(
            {
              ...data,
              collectionId: catalog?.id,
            },
            {
              onSuccess() {
                toast.toast({
                  description: catalog?.id
                    ? "Changes saved"
                    : "New catalog created",
                });

                if (!catalog) {
                  router.push("/my-shop/catalog");
                }
              },
              onError() {
                toast.toast({
                  title: "Error",
                  description: "Something went wrong",
                  variant: "destructive",
                });
              },
            },
          );
        })}
      >
        <FormTextField
          control={control}
          name="name"
          label="Catalog Name"
          disabled={isLoading}
        />

        <ProductAutocomplete
          products={products}
          disabled={isLoading}
          onSelectedProductsChange={(selectedProducts) =>
            setValue(
              "productIds",
              selectedProducts.map((product) => product.id),
            )
          }
        />

        <SelectedProducts products={products} disabled={isLoading} />

        <div className="flex justify-end gap-4">
          {!!catalog?.id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <LoadingButton
                  variant="ghost"
                  disabled={isSubmitting}
                  loading={isDeleting}
                  type="button"
                >
                  Delete
                </LoadingButton>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this catalog?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() => {
                      deleteCatalog(catalog.id, {
                        onSuccess() {
                          toast.toast({
                            description: "Catalog deleted",
                          });

                          router.replace("/my-shop/catalog");
                        },
                        onError() {
                          toast.toast({
                            title: "Error",
                            description: "Please try again later",
                            variant: "destructive",
                          });
                        },
                      });
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <LoadingButton
            type="submit"
            loading={isSubmitting}
            disabled={isDeleting}
          >
            {catalog?.id ? "Save catalog" : "Create catalog"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}

function SelectedProducts({
  products,
  disabled,
}: {
  products: Product[];
  disabled: boolean;
}) {
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
    <Card>
      <CardHeader>
        <CardTitle>Selected Products</CardTitle>
        <CardDescription>
          {productIDs.length} products will be included in the catalog
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {!!productIDs.length &&
          productIDs.map((id) => {
            const product = map[id]!;

            return (
              <div key={id} className="flex max-w-md items-center gap-3">
                <Image
                  src={imageUrl(product.image)}
                  width={60}
                  height={60}
                  alt={`Image of ${product.name}`}
                  className="aspect-square rounded-md object-cover"
                />

                <div className="flex-1">
                  <p>{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.price}
                  </p>
                </div>

                <Button
                  disabled={disabled}
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
      </CardContent>
    </Card>
  );
}

type Product = typeof products.$inferSelect;

type ProductAutocompleteProps = {
  products: Product[];
  onSelectedProductsChange?(products: Product[]): void;
  disabled?: boolean;
};

function ProductAutocomplete({
  products,
  onSelectedProductsChange,
  disabled,
}: ProductAutocompleteProps) {
  const { watch, setValue, getFieldState } =
    useFormContext<CatalogFormSchema>();
  const { error } = getFieldState("productIds");

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
      !inputValue ||
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
        disabled={disabled}
      />
      <FormError error={error} />

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
                  className="mr-3 aspect-square rounded-md object-cover"
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
