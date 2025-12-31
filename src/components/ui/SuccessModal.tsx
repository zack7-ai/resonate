"use client";

import { X, CheckCircle, Share2, Linkedin } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
}

export default function SuccessModal({
  isOpen,
  onClose,
  score,
}: SuccessModalProps) {
  if (!isOpen) return null;

  const handleLinkedInShare = () => {
    const text = encodeURIComponent(
      `Just achieved a perfect ${score}/100 First Time Quality score on my resume using @Resonate! 🎯\n\nStop guessing. Start resonating. ✨`
    );
    const url = encodeURIComponent(window.location.origin);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`;
    window.open(linkedInUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-green-900/50 bg-slate-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-900/50 p-4">
              <CheckCircle className="h-12 w-12 text-brand-green" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">
            System Optimized
          </h2>
          <p className="text-lg font-semibold text-brand-green">
            FTQ Score: {score}/100
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Your resume has passed all quality checks!
          </p>
        </div>

        {/* Share Section */}
        <div className="mb-6 rounded-lg border border-green-900/30 bg-green-950/20 p-4">
          <p className="mb-4 text-center text-sm text-gray-300">
            Share your achievement on LinkedIn and help others optimize their
            careers!
          </p>
          <button
            onClick={handleLinkedInShare}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0077b5] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#006399]"
          >
            <Linkedin className="h-5 w-5" />
            Share on LinkedIn
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-800 bg-slate-800 px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-slate-700 hover:border-gray-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

