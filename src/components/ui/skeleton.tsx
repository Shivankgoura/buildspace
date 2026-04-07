import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-[#f3f3f6] dark:bg-[#1a2035]", className)}
      {...props}
    />
  );
}

export { Skeleton };
