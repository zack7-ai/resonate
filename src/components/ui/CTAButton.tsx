"use client";

import { SignInButton } from "@clerk/nextjs";

export default function CTAButton() {
  return (
    <SignInButton mode="modal">
      <button
        className="group relative mt-4 overflow-hidden rounded-lg bg-gradient-to-r from-brand-blue to-brand-green px-8 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.7)]"
      >
        <span className="relative z-10">Initialize Launch Sequence</span>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-brand-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>
    </SignInButton>
  );
}

