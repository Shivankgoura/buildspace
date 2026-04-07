import { cn } from "@/lib/utils";

interface LogoIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const svgSizeMap = {
  sm: 16,
  md: 20,
  lg: 28,
};

export function LogoIcon({ size = "md", className }: LogoIconProps) {
  const s = svgSizeMap[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg [background:linear-gradient(135deg,#001c64,#003087)] shadow-[0_2px_8px_rgba(0,28,100,0.2)]",
        sizeMap[size],
        className
      )}
    >
      <svg
        width={s}
        height={s}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized "B" + building/blocks mark */}
        <path
          d="M8 6h10a5 5 0 0 1 0 10H8V6Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M8 16h12a5 5 0 0 1 0 10H8V16Z"
          fill="white"
        />
        <rect x="8" y="6" width="3.5" height="20" rx="1" fill="white" />
        {/* Accent spark */}
        <circle cx="24" cy="8" r="2.5" fill="#449afb" />
        <path
          d="M24 4v2M24 10v2M20 8h2M26 8h2"
          stroke="#449afb"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

interface LogoBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

const textSizeMap = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-2xl",
};

export function LogoBrand({ size = "md", className, showText = true }: LogoBrandProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size={size} />
      {showText && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-[#001c64] to-[#003087] dark:from-[#449afb] dark:to-[#0070e0] bg-clip-text text-transparent",
            textSizeMap[size]
          )}
        >
          BuildSpace
        </span>
      )}
    </div>
  );
}
