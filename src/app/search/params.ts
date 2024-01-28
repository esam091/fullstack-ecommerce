import { type ProductSearchParamsInput } from "@/lib/schemas/product";

export default function buildSearchParam(
  newSearchParams: ProductSearchParamsInput,
) {
  const urlSearchParams = new URLSearchParams();

  if (newSearchParams.keyword) {
    urlSearchParams.append("q", newSearchParams.keyword);
  }

  if (newSearchParams.minPrice) {
    urlSearchParams.append("min", String(newSearchParams.minPrice));
  }

  if (newSearchParams.maxPrice) {
    urlSearchParams.append("max", String(newSearchParams.maxPrice));
  }

  if (newSearchParams.new) {
    urlSearchParams.append("n", "1");
  }

  if (newSearchParams.used) {
    urlSearchParams.append("u", "1");
  }

  if (newSearchParams.sort) {
    urlSearchParams.append("s", String(newSearchParams.sort));
  }

  if (newSearchParams.categoryIds) {
    for (const id of newSearchParams.categoryIds) {
      urlSearchParams.append("c", id);
    }
  }

  if (newSearchParams.page) {
    urlSearchParams.append("p", String(newSearchParams.page));
  }

  return urlSearchParams;
}
