import EmptyView from "@/components/ui/empty-view";

export default function MyProductNotFound() {
  return (
    <EmptyView
      title="Product not found"
      action={{
        href: "/my-shop/products",
        title: "Back to my products",
      }}
    />
  );
}
