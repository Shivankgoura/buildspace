import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0070e0]/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "text-white shadow-md hover:shadow-lg transition-all duration-200 [background:linear-gradient(135deg,#001c64,#003087)] hover:[background:linear-gradient(135deg,#002d7a,#0070e0)] hover:-translate-y-[1px] active:translate-y-0",
        destructive: "bg-[#c0392b] text-white shadow-sm hover:bg-[#a93226]",
        outline: "border border-[#e2e2e2] bg-white text-[#003087] shadow-sm hover:bg-[#f3f3f6] hover:border-[#003087] dark:bg-transparent dark:text-[#449afb] dark:border-[#1e293b] dark:hover:bg-[#1a2035]",
        secondary: "bg-[#f3f3f6] dark:bg-[#1a2035] text-[#1e3251] dark:text-[#e2e8f0] shadow-sm hover:bg-[#e2e2e2] dark:hover:bg-[#252d45]",
        ghost: "hover:bg-[#f3f3f6] dark:hover:bg-[#1a2035] hover:text-[#001c64] dark:hover:text-white",
        link: "text-[#003087] underline-offset-4 hover:underline dark:text-[#449afb]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-4 py-2 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
