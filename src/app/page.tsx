import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { db } from "@/server/db";
import { products, shops } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import imageUrl from "@/lib/imageUrl";
import Image from "next/image";
import { ProductCard } from "./shop/[shopId]/ProductCard";

export default async function Component() {
  const [featuredProduct] = await db
    .select()
    .from(products)
    .orderBy(sql`RAND()`)
    .limit(1);

  const popularProducts = await db
    .select()
    .from(products)
    .innerJoin(shops, eq(shops.id, products.shopId))
    .orderBy(sql`RAND()`)
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {!!featuredProduct && (
          <section className="bg-gray-100 px-6 py-12 dark:bg-gray-900">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-3xl font-bold md:text-4xl">
                Featured Product
              </h1>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                Check out our latest and greatest product that you're sure to
                love.
              </p>
              <div className="flex items-center justify-center">
                <Image
                  alt="Featured product"
                  className="aspect-square h-64 w-64 rounded-lg object-cover shadow-lg"
                  height={400}
                  src={imageUrl(featuredProduct.image)}
                  width={400}
                />
              </div>
              <h2 className="mt-8 text-2xl font-bold">
                {featuredProduct.name}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {featuredProduct.description}
              </p>

              <Button className="mt-8" asChild>
                <Link href={`/product/${featuredProduct.id}`}>Shop Now</Link>
              </Button>
            </div>
          </section>
        )}
        {/* <section className="px-6 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <MusicIcon className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">Music</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <BookOpenIcon className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">Books</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <FilmIcon className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">Movies</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <GamepadIcon className="mb-4 h-12 w-12" />
                <h3 className="text-lg font-semibold">Games</h3>
              </CardContent>
            </Card>
          </div>
        </section> */}
        <section className="px-6 py-12">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Popular Products
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {popularProducts.map((popularProduct) => (
              <ProductCard
                product={popularProduct.product}
                shop={popularProduct.shop}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
