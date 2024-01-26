import { api } from "@/trpc/server";
import FilterBar from "./filter-bar";
import { searchSchema } from "@/lib/schemas/product";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const sanitizedSearchParams = searchSchema.parse({
    keyword: searchParams.q,
    minPrice: searchParams.min,
    maxPrice: searchParams.max,
    condition: searchParams.c,
    categoryId: searchParams.cat,
    sort: searchParams.s,
  });

  const products = await api.product.search.query(sanitizedSearchParams);

  return (
    <div className="grid grid-cols-5">
      <FilterBar searchParams={sanitizedSearchParams} />
      <div className="col-span-4">
        Products
        <code>{JSON.stringify(products, null, 2)}</code>
      </div>
    </div>
  );
}
