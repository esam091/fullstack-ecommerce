import { api } from "@/trpc/server";
import FilterBar from "./filter-bar";
import { searchSchema } from "@/lib/schemas/product";
import { ProductCard } from "../shop/[shopId]/ProductCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const sanitizedSearchParams = searchSchema.parse({
    keyword: searchParams.q,
    minPrice: searchParams.min,
    maxPrice: searchParams.max,
    sort: searchParams.s,
    new: searchParams.n === "1",
    used: searchParams.u === "1",
    categoryIds:
      typeof searchParams.c === "string" ? [searchParams.c] : searchParams.c,
  });

  const products = api.product.search.query(sanitizedSearchParams);
  const categories = api.product.getCategories.query();

  return (
    <div className="grid grid-cols-5">
      <FilterBar
        searchParams={sanitizedSearchParams}
        categories={await categories}
      />
      <div className="col-span-4">
        Products
        <div className="grid grid-cols-4 gap-8">
          {(await products).map((product) => (
            <ProductCard product={product.product} shop={product.shop} />
          ))}
        </div>
      </div>
    </div>
  );
}
