import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-[0.9375rem] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#999] focus-visible:outline-none focus-visible:border-[#0070e0] focus-visible:ring-[3px] focus-visible:ring-[#0070e033] disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-[#f3f3f6] transition-[border-color,box-shadow] duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
