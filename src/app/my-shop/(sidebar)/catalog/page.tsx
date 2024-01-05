import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import imageUrl from "@/lib/imageUrl";
import { api } from "@/trpc/server";
import Image from "next/image";

export default async function Page() {
  const myCatalogs = await api.catalog.myCatalogs.query();
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">My Catalogs</h3>
      <div className="space-y-6">
        {myCatalogs.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
