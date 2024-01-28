import { api } from "@/trpc/server";
import FilterBar from "./filter-bar";
import { searchSchema } from "@/lib/schemas/product";
import { ProductCard } from "../shop/[shopId]/ProductCard";
import EmptyView from "@/components/ui/empty-view";
import { SearchX } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    page: searchParams.p,
  });

  const categories = api.product.getCategories.query();
  const products = await api.product.search.query(sanitizedSearchParams);

  return (
    <div className="grid grid-cols-5 gap-8">
      <FilterBar
        searchParams={sanitizedSearchParams}
        categories={await categories}
      />
      <div className="col-span-4">
        Products
        {!products.length && (
          <EmptyView
            icon={<SearchX size={40} />}
            title="No products found"
            description="Try tweaking your search keywords or filters"
          />
        )}
        {!!products.length && (
          <>
            <div className="grid grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard product={product.product} shop={product.shop} />
              ))}
            </div>

            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
