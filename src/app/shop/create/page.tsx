"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/ui/form-textfield";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

const fromSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  image: z.string(),
});

export default function Page() {
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
  });

  const { handleSubmit, control } = form;
  const toast = useToast();

  const createShop = api.shop.createShop.useMutation();

  const onSubmit = async (data: z.infer<typeof fromSchema>) => {
    createShop.mutate(data, {
      onSuccess: () => {
        toast.toast({ title: "Shop created successfully" });
      },
      onError: () => {
        toast.toast({ title: "Failed to create shop" });
      },
    });
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

            <FormTextField
              control={control}
              name="image"
              label="Image"
              type="file"
            />

            <div className="flex items-center justify-between">
              <Button type="submit">Create Shop</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
