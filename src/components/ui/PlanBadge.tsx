"use client";

import { useSubscription } from "@/hooks/useSubscription";

interface PlanBadgeProps {
  className?: string;
}

export function PlanBadge({ className = "" }: PlanBadgeProps) {
  const { isPremium } = useSubscription();

  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const premiumClasses = "bg-brand-green/20 text-brand-green border border-brand-green/30";
  const freeClasses = "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  
  const badgeClassName = isPremium 
    ? `${baseClasses} ${premiumClasses} ${className}`.trim()
    : `${baseClasses} ${freeClasses} ${className}`.trim();

  return (
    <span className={badgeClassName}>
      {isPremium ? "Pro" : "Free"}
    </span>
  );
}


