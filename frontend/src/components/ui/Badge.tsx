import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
  size?: "sm" | "md";
}

export function Badge({ className, variant = "primary", size = "sm", children, ...props }: BadgeProps) {
  const variants = {
    primary: "bg-primary-light text-primary border border-[#D5E4FF]",
    secondary: "bg-[#F1F5F9] text-navy border border-border",
    success: "bg-success-light text-success border border-[#CDEEDC]",
    warning: "bg-warning-light text-warning border border-[#FBE3B5]",
    error: "bg-error-light text-error border border-[#FAD3D3]",
    neutral: "bg-[#F8FAFC] text-muted border border-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium rounded-md",
    md: "px-2.5 py-1 text-xs font-semibold rounded-md",
  };

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 font-medium leading-none whitespace-nowrap", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
}
