import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import imageUrl from "@/lib/imageUrl";
import { api } from "@/trpc/server";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const myCatalogs = await api.catalog.myCatalogs.query();
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h3 className="text-xl font-semibold">My Catalogs</h3>

        <Button asChild variant={"outline"}>
          <Link href="/my-shop/catalog/add">New catalog</Link>
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {myCatalogs.map((item) => (
          <Link href={`/my-shop/catalog/edit/${item.catalog.id}`}>
            <Card key={item.catalog.id}>
              <CardHeader>
                <CardTitle>{item.catalog.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 ">
                {item.products.map((product) => (
                  <div key={product.id} className="flex items-center">
                    <Image
                      src={imageUrl(product.image)}
                      width={40}
                      height={40}
                      className="mr-3 h-10 w-10 rounded-md object-cover"
                      alt={`Image of ${product.name}`}
                    />{" "}
                    <span className="text-sm">{product.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
