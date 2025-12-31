"use client";

import { X, Crown, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import SeatsCounter from "@/components/billing/SeatsCounter";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string; // e.g., "AI Rewriting" or "Remove Watermark"
}

export default function UpgradeModal({
  isOpen,
  onClose,
  feature = "this feature",
}: UpgradeModalProps) {
  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-brand-blue/50 bg-slate-900 p-8 shadow-2xl shadow-glow-blue-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-brand-blue/20 p-4">
              <Crown className="h-8 w-8 text-brand-blue" />
            </div>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-white">
            System Locked
          </h2>
          <p className="text-gray-400">
            Upgrade to Founding Member to unlock {feature}
          </p>
        </div>

        {/* Scarcity Counter */}
        <div className="mb-6">
          <SeatsCounter totalSeats={100} seatsRemaining={16} />
        </div>

        {/* Benefits */}
        <div className="mb-6 space-y-3">
          {[
            "Remove watermark from all downloads",
            "AI-powered resume rewriting",
            "Unlimited premium features",
            "Lifetime access (one-time payment)",
            "Priority customer support",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 flex-shrink-0 text-brand-green" />
              <span className="text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mb-6 rounded-lg border border-brand-green/30 bg-brand-green/5 p-4 text-center">
          <p className="text-sm text-gray-400">One-Time Payment</p>
          <p className="text-3xl font-bold text-brand-green">$49</p>
          <p className="mt-1 text-xs text-gray-500">
            Regular: $9.99/month • Save $1,199+ over 10 years
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/founding-member"
            onClick={onClose}
            className="group flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-blue to-brand-green px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
          >
            <span>Secure Lifetime Access ($49)</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={onClose}
            className="text-center text-sm text-gray-400 transition-colors hover:text-gray-300"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

