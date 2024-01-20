"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProductFields, productSchema } from "src/lib/schemas/product";
import { api } from "@/trpc/react";
import { useToast } from "src/components/ui/use-toast";
import FormTextField from "src/components/ui/form-textfield";
import FormImageUpload from "src/components/ui/form-image-upload";
import { Form, FormLabel } from "@/components/ui/form";
import { type products } from "@/server/db/schema";
import FormTextarea from "@/components/ui/form-textarea";
import { LoadingButton } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Product = typeof products.$inferSelect;

type Props = {
  product?: Product;
};

export default function AddEditProductForm({ product }: Props) {
  const form = useForm<ProductFields>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...product },
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">
          {product ? "Edit Product" : "New Product"}
        </h2>

        <FormTextField
          control={control}
          name="name"
          label="Product Name"
          disabled={createOrUpdateProduct.isLoading}
        />

        <FormTextarea
          control={control}
          name="description"
          label="Product Description"
          disabled={createOrUpdateProduct.isLoading}
        />

        <FormTextField
          control={control}
          name="stock"
          label="Stock"
          placeholder="12"
          disabled={createOrUpdateProduct.isLoading}
        />

        <FormImageUpload control={control} name="image" label="Product Image" />

        <FormTextField
          placeholder="5.20"
          control={control}
          name="price"
          label="Product Price"
          disabled={createOrUpdateProduct.isLoading}
        />

        <ConditionRadioGroup />

        <LoadingButton
          type="submit"
          loading={createOrUpdateProduct.isLoading}
          className="self-start"
        >
          {product ? "Save product" : "Create product"}
        </LoadingButton>
      </form>
    </Form>
  );
}

function ConditionRadioGroup() {
  return (
    <div className="space-y-2">
      <FormLabel>Condition</FormLabel>
      <RadioGroup className="flex gap-3">
        <Label className="flex items-center">
          <RadioGroupItem value="new" className="mr-1" />
          New
        </Label>
        <Label className="flex items-center">
          <RadioGroupItem value="used" className="mr-1" />
          Used
        </Label>
      </RadioGroup>
    </div>
  );
}
