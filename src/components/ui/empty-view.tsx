import { cx } from "class-variance-authority";

interface EmptyViewProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function EmptyView({
  icon,
  title,
  description,
  className,
}: EmptyViewProps) {
  return (
    <div className={cx("flex flex-col items-center", className)}>
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
