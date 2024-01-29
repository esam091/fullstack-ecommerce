import EmptyView from "@/components/ui/empty-view";

export default function ProductNotFound() {
  return (
    <EmptyView
      title="Product not found"
      action={{ href: "/", title: "Back to home page" }}
    />
  );
}
