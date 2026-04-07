import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-[0.9375rem] ring-offset-background placeholder:text-[#999] focus-visible:outline-none focus-visible:border-[#0070e0] focus-visible:ring-[3px] focus-visible:ring-[#0070e033] disabled:cursor-not-allowed disabled:opacity-70 resize-y transition-[border-color,box-shadow] duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
