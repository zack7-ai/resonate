"use client";

import { X, AlertCircle } from "lucide-react";
import { FTQError } from "@/utils/ftqChecker";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errors: FTQError[];
  score: number;
}

export default function ErrorModal({
  isOpen,
  onClose,
  errors,
  score,
}: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-red-900/50 bg-slate-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-full bg-red-900/50 p-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">FTQ Check Failed</h2>
            <p className="text-sm text-gray-400">
              Quality Score: {score}/100
            </p>
          </div>
        </div>

        {/* Error List */}
        <div className="mb-6 max-h-96 space-y-2 overflow-y-auto">
          <p className="mb-4 text-sm text-gray-300">
            Please fix the following issues before downloading:
          </p>
          {errors.map((error, index) => (
            <div
              key={index}
              className="rounded-lg border border-red-900/30 bg-red-950/20 p-3"
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-300">
                    {error.message}
                  </p>
                  {error.field && (
                    <p className="mt-1 text-xs text-gray-400">
                      Field: {error.field}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-800 bg-slate-800 px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-slate-700 hover:border-gray-700"
          >
            I'll Fix These
          </button>
        </div>
      </div>
    </div>
  );
}

