import { api } from "@/trpc/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const products = await api.product.search.query({
    keyword: searchParams.q,
  });

  return (
    <div>
      Products
      <code>{JSON.stringify(products, null, 2)}</code>
    </div>
  );
}
