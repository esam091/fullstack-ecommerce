import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import { db } from "@/server/db";
import { products } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import imageUrl from "@/lib/imageUrl";
import Image from "next/image";

export default async function Component() {
  const [popularProduct] = await db
    .select()
    .from(products)
    .orderBy(sql`RAND()`)
    .limit(1);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {!!popularProduct && (
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
                  src={imageUrl(popularProduct.image)}
                  width={400}
                />
              </div>
              <h2 className="mt-8 text-2xl font-bold">{popularProduct.name}</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {popularProduct.description}
              </p>

              <Button className="mt-8" asChild>
                <Link href={`/product/${popularProduct.id}`}>Shop Now</Link>
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
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <img
                  alt="Product 1"
                  className="mb-4 h-32 w-32 rounded-lg object-cover shadow-lg"
                  height="200"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
                <h3 className="text-lg font-semibold">Product 1</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">$49.99</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <img
                  alt="Product 2"
                  className="mb-4 h-32 w-32 rounded-lg object-cover shadow-lg"
                  height="200"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
                <h3 className="text-lg font-semibold">Product 2</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">$99.99</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <img
                  alt="Product 3"
                  className="mb-4 h-32 w-32 rounded-lg object-cover shadow-lg"
                  height="200"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
                <h3 className="text-lg font-semibold">Product 3</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">$19.99</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center text-center">
                <img
                  alt="Product 4"
                  className="mb-4 h-32 w-32 rounded-lg object-cover shadow-lg"
                  height="200"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width="200"
                />
                <h3 className="text-lg font-semibold">Product 4</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">$29.99</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-between bg-white px-6 py-4 dark:bg-gray-800">
        <div className="flex space-x-4">
          <Link
            className="text-gray-600 hover:underline dark:text-gray-400"
            href="#"
          >
            About Us
          </Link>
          <Link
            className="text-gray-600 hover:underline dark:text-gray-400"
            href="#"
          >
            Contact
          </Link>
          <Link
            className="text-gray-600 hover:underline dark:text-gray-400"
            href="#"
          >
            FAQ
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-400">© Acme Store</p>
      </footer>
    </div>
  );
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function FilmIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}

function GamepadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function MusicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function ShoppingBagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
