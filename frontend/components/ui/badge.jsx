import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[var(--primary)]/15 text-sky-700 dark:text-sky-300",
        secondary: "border-transparent bg-[var(--secondary)]/20 text-teal-700 dark:text-teal-300",
        accent: "border-transparent bg-[var(--accent)]/20 text-amber-700 dark:text-amber-300",
        outline: "text-[var(--foreground)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
