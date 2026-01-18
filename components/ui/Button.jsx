import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const base = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";
  const variants = {
    default: "bg-gray-800 text-white hover:bg-gray-700",
    ghost: "bg-transparent text-white/90 hover:bg-white/5",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <button ref={ref} className={cn(base, variants[variant] || variants.default, className)} {...props} />
  );
});
Button.displayName = "Button";

export default Button;
