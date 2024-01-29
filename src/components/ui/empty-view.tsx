import { cx } from "class-variance-authority";
import { Button } from "./button";
import Link from "next/link";

interface EmptyViewProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  action?: {
    href: string;
    title: string;
  };
}

export default function EmptyView({
  icon,
  title,
  description,
  className,
  action,
}: EmptyViewProps) {
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-center">{description}</p>

      {!!action && (
        <Button asChild>
          <Link href={action.href}>{action.title}</Link>
        </Button>
      )}
    </div>
  );
}
