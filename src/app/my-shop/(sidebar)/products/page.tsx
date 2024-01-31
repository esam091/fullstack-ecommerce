import { api } from "@/trpc/server";
import ProductRow from "./product-row";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyView from "@/components/ui/empty-view";

export const metadata = {
  title: "My products",
};

export default async function Page() {
  const products = await api.product.myProducts.query();

  if (products.length === 0) {
    return (
      <div>
        <EmptyView
          title="No products found"
          description="Add your first product and start selling"
          action={{
            title: "Add Product",
            href: "/my-shop/products/add",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline gap-5">
        <h3 className="text-xl font-semibold">Products</h3>

        <Button asChild size="sm" variant="secondary">
          <Link href="/my-shop/products/add">Add new</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <ProductRow product={product} key={product.id} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
