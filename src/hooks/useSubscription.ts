"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

interface SubscriptionStatus {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionStatus: string;
}

export function useSubscription(): SubscriptionStatus {
  const { user } = useUser();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("free");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check Clerk metadata first (fast)
        const clerkStatus = (user.publicMetadata?.subscription_status as string) || "free";
        
        // Also fetch from Supabase for accuracy
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus(data.subscription_status || clerkStatus);
        } else {
          setSubscriptionStatus(clerkStatus);
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        // Fallback to Clerk metadata
        const clerkStatus = (user.publicMetadata?.subscription_status as string) || "free";
        setSubscriptionStatus(clerkStatus);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, [user]);

  const isPremium = subscriptionStatus === "active" || subscriptionStatus === "premium" || subscriptionStatus === "pro";

  return {
    isPremium,
    isLoading,
    subscriptionStatus,
  };
}

