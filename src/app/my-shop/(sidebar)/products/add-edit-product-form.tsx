"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProductFields, productSchema } from "src/lib/schemas/product";
import { api } from "@/trpc/react";
import { useToast } from "src/components/ui/use-toast";
import FormTextField from "src/components/ui/form-textfield";
import FormImageUpload from "src/components/ui/form-image-upload";
import { Form } from "@/components/ui/form";
import { type products } from "@/server/db/schema";
import FormTextarea from "@/components/ui/form-textarea";

type Product = typeof products.$inferSelect;

type Props = {
  product?: Product;
};

export default function AddEditProductForm({ product }: Props) {
  const form = useForm<ProductFields>({
    resolver: zodResolver(productSchema),
    defaultValues: product,
  });

  const { handleSubmit, control } = form;
  const toast = useToast();

  const createOrUpdateProduct = api.product.createOrUpdate.useMutation();

  const onSubmit = async (data: ProductFields) => {
    createOrUpdateProduct.mutate(
      {
        ...data,
        productId: product?.id,
      },
      {
        onSuccess: () => {
          toast.toast({
            title: product?.id ? "Product updated" : "New product created",
          });
        },
        onError: (error) => {
          toast.toast({
            title: product?.id
              ? "Failed to edit product"
              : "Failed to create product",
            description: error.message,
          });
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTextField control={control} name="name" label="Product Name" />

        <FormTextarea
          control={control}
          name="description"
          label="Product Description"
        />

        <FormImageUpload control={control} name="image" label="Product Image" />

        <FormTextField control={control} name="price" label="Product Price" />

        <input type="submit" />
      </form>
    </Form>
  );
}
