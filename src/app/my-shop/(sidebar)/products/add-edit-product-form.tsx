"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProductFields, productSchema } from "src/lib/schemas/product";
import { api } from "@/trpc/react";
import { useToast } from "src/components/ui/use-toast";
import FormTextField from "src/components/ui/form-textfield";
import FormImageUpload from "src/components/ui/form-image-upload";
import { Form } from "@/components/ui/form";

export default function AddEditProductForm() {
  const form = useForm<ProductFields>({
    resolver: zodResolver(productSchema),
  });

  const { handleSubmit, control } = form;
  const toast = useToast();

  const createProduct = api.product.create.useMutation();

  const onSubmit = async (data: ProductFields) => {
    createProduct.mutate(data, {
      onSuccess: () => {
        toast.toast({ title: "Product created successfully" });
      },
      onError: (error) => {
        toast.toast({
          title: "Failed to create product",
          description: error.message,
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTextField control={control} name="name" label="Product Name" />

        <FormTextField
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
