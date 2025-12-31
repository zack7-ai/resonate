"use client";

import { ReactNode, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";

interface IconWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "warning";
  size?: number;
}

/**
 * IconWrapper - Adds futuristic 3D styling to any icon
 * Preserves original icon while adding depth, gradient, and glow effects
 */
export default function IconWrapper({
  children,
  className = "",
  variant = "default",
  size,
}: IconWrapperProps) {
  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const variants = {
    default: "icon-default",
    primary: "icon-primary",
    success: "icon-success",
    warning: "icon-success", // Reuse success gradient for warning (can be customized)
  };

  // Clone the element and add className and style
  const iconElement = cloneElement(children as React.ReactElement<any>, {
    className: cn(
      (children as React.ReactElement<any>).props?.className,
      variants[variant],
      className
    ),
    style: {
      ...((children as React.ReactElement<any>).props?.style || {}),
      filter: variant === "default" 
        ? "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(99, 102, 241, 0.25)) drop-shadow(0 0 12px rgba(99, 102, 241, 0.15))"
        : variant === "primary"
        ? "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 12px rgba(99, 102, 241, 0.5))"
        : variant === "success"
        ? "drop-shadow(0 2px 4px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 12px rgba(74, 222, 128, 0.5))"
        : "drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4)) drop-shadow(0 0 12px rgba(245, 158, 11, 0.5))",
      transform: "perspective(100px) translateZ(2px)",
      transformStyle: "preserve-3d",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      ...(size && { width: size, height: size }),
    },
  });

  return <>{iconElement}</>;
}

