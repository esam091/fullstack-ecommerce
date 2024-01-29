import EmptyView from "@/components/ui/empty-view";
import { HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <EmptyView
      icon={<HelpCircle size={40} />}
      title="Page not found"
      action={{
        href: "/",
        title: "Get me out of here",
      }}
    />
  );
}
