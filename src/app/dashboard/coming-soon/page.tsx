"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Construction, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const featureNames: Record<string, string> = {
  "cover-letter": "Cover Letter Generator",
  "interview-prep": "Interview Prep",
  "90-day-plan": "90-Day Plan",
  "resignation-protocol": "Resignation Protocol",
};

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const feature = searchParams.get("feature") || "this feature";
  const featureName = featureNames[feature] || feature.replace(/-/g, " ");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-2xl text-center">
        {/* Construction Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-slate-800 p-8">
            <Construction className="h-24 w-24 text-brand-blue" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold text-white">
          Module Under Construction
        </h1>

        {/* Description */}
        <p className="mb-2 text-xl text-gray-400">
          {featureName} is currently being built by our engineering team.
        </p>
        <p className="mb-8 text-gray-500">
          Check back soon for updates. This weapon is being forged with precision.
        </p>

        {/* Action Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-brand-green"
        >
          <ArrowLeft className="h-5 w-5" />
          Return to Command
        </Link>

        {/* Optional: Add a progress indicator or email signup */}
        <div className="mt-12 rounded-lg border border-gray-800 bg-slate-900/50 p-6">
          <p className="text-sm text-gray-400">
            Want to be notified when this feature launches?
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Join the Founding 100 to get early access to all new modules.
          </p>
          <Link
            href="/founding-member"
            className="mt-4 inline-block text-sm text-brand-blue hover:text-brand-green"
          >
            Learn More →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}

