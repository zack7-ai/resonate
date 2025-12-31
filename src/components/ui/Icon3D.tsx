"use client";

import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Icon3DProps {
  children: ReactNode;
  className?: string;
  size?: number;
  variant?: "default" | "primary" | "success" | "warning";
}

/**
 * Icon3D - Wraps any icon with futuristic 3D styling
 * Applies gradient fills, shadows, and depth effects
 */
export default function Icon3D({
  children,
  className = "",
  size = 20,
  variant = "default",
}: Icon3DProps) {
  const variants = {
    default: {
      gradient: "linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)",
      shadow: "0 4px 6px rgba(255, 255, 255, 0.1), 0 0 20px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
      glow: "0 0 10px rgba(99, 102, 241, 0.4)",
    },
    primary: {
      gradient: "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)",
      shadow: "0 4px 6px rgba(99, 102, 241, 0.3), 0 0 20px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      glow: "0 0 15px rgba(99, 102, 241, 0.6)",
    },
    success: {
      gradient: "linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)",
      shadow: "0 4px 6px rgba(74, 222, 128, 0.3), 0 0 20px rgba(74, 222, 128, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      glow: "0 0 15px rgba(74, 222, 128, 0.6)",
    },
    warning: {
      gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
      shadow: "0 4px 6px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
      glow: "0 0 15px rgba(245, 158, 11, 0.6)",
    },
  };

  const style: CSSProperties = {
    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(99, 102, 255, 0.2))",
    transform: "perspective(1000px) rotateX(2deg) rotateY(-2deg)",
    transformStyle: "preserve-3d",
  };

  const variantStyle = variants[variant];

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      style={{
        ...style,
        background: variantStyle.gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: `drop-shadow(${variantStyle.shadow.split(",")[0]}) drop-shadow(${variantStyle.glow})`,
        textShadow: variantStyle.shadow,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4)) drop-shadow(${variantStyle.glow})`,
          transform: "translateZ(10px)",
        }}
      >
        {children}
      </span>
    </span>
  );
}


