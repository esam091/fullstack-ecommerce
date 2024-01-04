"use client";
import { LoadingButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/ui/form-textfield";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import FormImageUpload from "@/components/ui/form-image-upload";

const fromSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9 ]+$/i, {
      message: "Name must be alphanumeric and can contain spaces",
    }),
  location: z.string().min(1, "Required"),
  image: z.string({ required_error: "Shop image is required" }),
});

export default function Page() {
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      location: "",
      name: "",
    },
  });

  const { handleSubmit, control } = form;
  const toast = useToast();

  const createShop = api.shop.createShop.useMutation();

  const onSubmit = async (data: z.infer<typeof fromSchema>) => {
    createShop.mutate(
      { ...data },
      {
        onSuccess: () => {
          toast.toast({ title: "Shop created successfully" });
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
    <Card className="mx-auto w-full max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Create Your Shop</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField
              control={control}
              name="name"
              label="Shop Name"
              placeholder="My awesome shop"
            />

            <FormTextField
              control={control}
              label="Location"
              placeholder="New York"
              name="location"
              description="This will be used to calculate shipping costs to customers"
            />

            <FormImageUpload
              control={control}
              name="image"
              label="Image"
              description="This is used as your brand image"
            />

            <div className="flex items-center justify-between">
              <LoadingButton type="submit">Create Shop</LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
