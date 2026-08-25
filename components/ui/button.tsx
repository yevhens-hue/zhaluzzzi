import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glow"
    | "accent";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none cursor-pointer";

    const variants = {
      default:
        "bg-blue-600 text-white shadow-xs hover:bg-blue-700 hover:shadow-md",
      destructive:
        "bg-red-600 text-white shadow-xs hover:bg-red-700 hover:shadow-md",
      outline:
        "border border-gray-200 bg-white text-gray-900 shadow-2xs hover:bg-gray-50 hover:border-gray-300",
      secondary:
        "bg-gray-100 text-gray-900 shadow-2xs hover:bg-gray-200",
      ghost:
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      link:
        "text-blue-600 underline-offset-4 hover:underline",
      glow:
        "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-indigo-700",
      accent:
        "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:from-amber-600 hover:to-orange-600",
    };

    const sizes = {
      default: "h-11 px-5 py-2.5",
      sm: "h-9 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-base",
      xl: "h-14 rounded-2xl px-8 text-base font-bold",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
