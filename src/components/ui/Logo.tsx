import React from "react";

interface LogoProps {
  variant?: "icon" | "full";
  className?: string;
}

export default function Logo({ variant = "full", className = "" }: LogoProps) {
  // Icon: Three rising vertical bars inside a rounded square
  const IconMark = () => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      aria-hidden="true"
    >
      {/* Rounded square container */}
      <rect
        x="2"
        y="2"
        width="28"
        height="28"
        rx="6"
        fill="currentColor"
        className="opacity-10"
      />
      
      {/* Three rising vertical bars (resonance wave) */}
      {/* Bar 1 - Smallest */}
      <rect
        x="8"
        y="18"
        width="3"
        height="6"
        rx="1.5"
        fill="currentColor"
      />
      
      {/* Bar 2 - Medium */}
      <rect
        x="13.5"
        y="14"
        width="3"
        height="10"
        rx="1.5"
        fill="currentColor"
      />
      
      {/* Bar 3 - Tallest */}
      <rect
        x="19"
        y="10"
        width="3"
        height="14"
        rx="1.5"
        fill="currentColor"
      />
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={`flex items-center ${className}`}>
        <IconMark />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconMark />
      <span className="text-xl font-bold tracking-wider text-foreground">
        RESONATE
      </span>
    </div>
  );
}
