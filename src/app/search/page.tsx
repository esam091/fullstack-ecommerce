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
import buildSearchParam from "./params";

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
  const { rows, pageCount } = await api.product.search.query(
    sanitizedSearchParams,
  );
  const page = sanitizedSearchParams.page ?? 1;

  return (
    <div className="grid grid-cols-5 gap-8">
      <FilterBar
        searchParams={sanitizedSearchParams}
        categories={await categories}
      />
      <div className="col-span-4">
        <div>
          count: {pageCount}, page: {page}
        </div>
        Products
        {!rows.length && (
          <EmptyView
            icon={<SearchX size={40} />}
            title="No products found"
            description="Try tweaking your search keywords or filters"
          />
        )}
        {!!rows.length && (
          <>
            <div className="grid grid-cols-4 gap-8">
              {rows.map((product) => (
                <ProductCard product={product.product} shop={product.shop} />
              ))}
            </div>

            <div className="mt-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href={`/search?${buildSearchParam({
                        ...sanitizedSearchParams,
                        page: 1,
                      }).toString()}`}
                      isActive={page === 1}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>

                  {pageCount > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        isActive={page === pageCount}
                        href={`/search?${buildSearchParam({
                          ...sanitizedSearchParams,
                          page: pageCount,
                        }).toString()}`}
                      >
                        {pageCount}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={`/search?${buildSearchParam({
                        ...sanitizedSearchParams,
                        page: page + 1,
                      }).toString()}`}
                    />
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
