"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormTextField from "@/components/ui/form-textfield";

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

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Create Your Shop</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            className="grid gap-6"
            onSubmit={handleSubmit(
              (data) => {
                console.log("done");
              },
              () => alert("failed"),
            )}
          >
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
