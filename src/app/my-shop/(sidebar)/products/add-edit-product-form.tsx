"use client";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProductFields, productSchema } from "src/lib/schemas/product";
import { api } from "@/trpc/react";
import { useToast } from "src/components/ui/use-toast";
import FormTextField from "src/components/ui/form-textfield";
import FormImageUpload from "src/components/ui/form-image-upload";
import {
  Form,
  FormControl,
  FormError,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type products } from "@/server/db/schema";
import FormTextarea from "@/components/ui/form-textarea";
import { LoadingButton } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";

type Product = typeof products.$inferSelect;

type Props = {
  product?: Product;
  categories: inferRouterOutputs<AppRouter>["product"]["getCategories"];
};

export default function AddEditProductForm({ product, categories }: Props) {
  const form = useForm<ProductFields>({
    resolver: zodResolver(productSchema),
    defaultValues: { ...product },
  });

  const { handleSubmit, control } = form;
  const toast = useToast();

  const createOrUpdateProduct = api.product.createOrUpdate.useMutation();

  const router = useRouter();

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

          if (!product?.id) {
            router.push("/my-shop/products");
          }
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

        <ProductCategoryField
          categories={categories}
          categoryId={product?.categoryId}
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
  const { control } = useFormContext<ProductFields>();

  return (
    <FormField
      control={control}
      name="condition"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Condition</FormLabel>
          <RadioGroup
            className="flex gap-3"
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            value={field.value}
          >
            <Label className="flex items-center">
              <RadioGroupItem value="used" id="option-used" className="mr-1" />
              Used
            </Label>
            <Label className="flex items-center">
              <RadioGroupItem value="new" id="option-new" className="mr-1" />
              New
            </Label>
          </RadioGroup>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ProductCategoryField({
  categories,
  categoryId,
}: {
  categories: inferRouterOutputs<AppRouter>["product"]["getCategories"];
  categoryId?: string;
}) {
  const { control } = useFormContext<ProductFields>();

  return (
    <FormField
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Product Category</FormLabel>

          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
