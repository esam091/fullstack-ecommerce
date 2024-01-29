"use client";
import { LoadingButton } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormError } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/ui/form-textfield";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import FormImageUpload from "@/components/ui/form-image-upload";
import { useRouter } from "next/navigation";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";
import Turnstile from "react-turnstile";
import { env } from "@/env";
import { shopSchema } from "@/lib/schemas/shop";
import { type z } from "zod";

type Props = {
  shop?: inferRouterOutputs<AppRouter>["shop"]["myShop"];
};

export default function ShopAddEditForm({ shop }: Props) {
  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: shop?.name,
      location: shop?.location,
      image: shop?.image,
    },
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    resetField,
  } = form;
  const toast = useToast();

  const createOrUpdateShop = api.shop.createOrUpdate.useMutation();

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof shopSchema>) => {
    createOrUpdateShop.mutate(
      { ...data },
      {
        onSuccess: () => {
          if (shop) {
            toast.toast({ title: "Shop profile updated" });
          } else {
            toast.toast({ title: "Shop created successfully" });
            router.replace("/my-shop");
          }
        },
        onError: (error) => {
          toast.toast({
            title: "Failed to create shop",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="max-w-2xl">
      <CardHeader>
        <CardTitle>{shop ? "Edit Shop Profile" : "Create Your Shop"}</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField
              control={control}
              name="name"
              label="Shop Name"
              placeholder="My awesome shop"
              disabled={createOrUpdateShop.isLoading}
            />

            <FormTextField
              control={control}
              label="Location"
              placeholder="New York"
              name="location"
              description="This will be used to calculate shipping costs to customers"
              disabled={createOrUpdateShop.isLoading}
            />

            <FormImageUpload
              control={control}
              name="image"
              label="Image"
              description="This is used as your brand image"
            />

            <div>
              <Turnstile
                sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                fixedSize
                onVerify={(token) => setValue("turnstileToken", token)}
                onExpire={() => resetField("turnstileToken")}
              />
              <FormError error={errors.turnstileToken} />
            </div>

            <div className="flex items-center justify-between">
              <LoadingButton
                type="submit"
                loading={createOrUpdateShop.isLoading}
              >
                Create Shop
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
