"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CreditCard, User, Settings as SettingsIcon, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { createClient } from "@supabase/supabase-js";
import UpgradeModal from "@/components/ui/UpgradeModal";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { isPremium, isLoading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentSalary, setCurrentSalary] = useState<number>(0);
  const [salaryLoading, setSalaryLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      fetchCurrentSalary();
      setLoading(false);
    }
  }, [isLoaded, user]);

  const fetchCurrentSalary = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setCurrentSalary(data.current_salary || 0);
      }
    } catch (error) {
      console.error("Error fetching current salary:", error);
    }
  };

  const handleSaveSalary = async () => {
    setSalaryLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ current_salary: currentSalary }),
      });

      if (!response.ok) {
        throw new Error("Failed to update salary");
      }

      alert("Salary updated successfully!");
    } catch (error) {
      console.error("Error updating salary:", error);
      setError("Failed to update salary. Please try again.");
    } finally {
      setSalaryLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);

    try {
      // Update Clerk user profile
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Also update Supabase if needed (for consistency)
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      // Note: We can't directly update the profile name in Supabase easily
      // since it's derived from Clerk. But we can ensure the profile exists.
      
      setError(null);
      // Show success feedback (could use a toast here)
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create portal session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Error opening portal:", error);
      setError(error.message || "Failed to open subscription portal. Please try again.");
      setPortalLoading(false);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column: Profile */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">Profile</h2>
            </div>

            <div className="space-y-4">
              {/* Email (Read-only) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.primaryEmailAddress?.emailAddress || ""}
                  disabled
                  className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Email cannot be changed here. Update it in your account settings.
                </p>
              </div>

              {/* First Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Current Salary */}
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Current Annual Salary (USD)
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 text-sm text-muted-foreground">$</span>
                  <input
                    type="number"
                    value={currentSalary || ""}
                    onChange={(e) => setCurrentSalary(parseInt(e.target.value) || 0)}
                    placeholder="120000"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Used for market value benchmarking. This information is private.
                </p>
              </div>

              {/* Save Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveSalary}
                  disabled={salaryLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salaryLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Salary"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Subscription */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">Subscription</h2>
            </div>

            {subscriptionLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading subscription status...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Plan */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">
                    Current Plan
                  </label>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                        isPremium
                          ? "border-success/20 bg-success/10 text-success"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {isPremium ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {isPremium ? (
                  <div>
                    <button
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {portalLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          Manage Subscription
                        </>
                      )}
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Update payment method, view invoices, or cancel your subscription.
                    </p>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <CreditCard className="h-4 w-4" />
                      Upgrade to Pro
                    </button>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Unlock all features with a Pro subscription.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </div>
  );
}
