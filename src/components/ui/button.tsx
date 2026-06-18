import { cn } from "@/lib/utils";

/**
 * Base button primitive. Establishes the `components/ui` convention: small,
 * unstyled-by-default primitives composed with Tailwind via `cn`. Extend with
 * more variants (or adopt Radix/shadcn) as the UI is ported.
 */
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-foreground text-background hover:opacity-90",
  outline: "border border-foreground/20 hover:bg-foreground/5",
  ghost: "hover:bg-foreground/5",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
