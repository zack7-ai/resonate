"use client";

import Link from "next/link";
import RezPulse from "@/components/ui/RezPulse";
import SeatsCounter from "@/components/billing/SeatsCounter";
import { Check, ArrowRight, Crown } from "lucide-react";

export default function FoundingMemberPage() {
  const stripePaymentLink =
    process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
    "https://buy.stripe.com/founding-member-link";

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Ultra-premium "Black on Black" aesthetic */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-brand-green/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto max-w-4xl px-6 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <RezPulse status="default" />
            </div>
            <h1 className="mb-4 text-5xl font-bold text-white">
              Join the Founding 100
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-400">
              Lifetime Access to the Resonate Command Center. Only 100 seats
              available.
            </p>
          </div>

          {/* The Counter - Seats Remaining */}
          <div className="mb-12">
            <SeatsCounter totalSeats={100} seatsRemaining={16} />
          </div>

          {/* The Offer Stack - Benefits */}
          <div className="mb-12 rounded-xl border border-gray-800 bg-slate-900 p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-white">
              What You Get
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Bennett Engine
                  </h3>
                  <p className="text-gray-400">
                    Pixel-perfect resume generator with the executive format
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Hunter Extension
                  </h3>
                  <p className="text-gray-400">
                    Chrome extension for auto-filling applications and scraping
                    data
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Priority Support
                  </h3>
                  <p className="text-gray-400">
                    Founding members get priority customer support
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Lifetime Access
                  </h3>
                  <p className="text-gray-400">
                    One-time payment, unlimited access forever
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  <Check className="h-6 w-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    All Future Features
                  </h3>
                  <p className="text-gray-400">
                    Access to all premium features and updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href={stripePaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.7)]"
            >
              <span>Secure My Seat ($49)</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Secure checkout powered by Stripe • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
