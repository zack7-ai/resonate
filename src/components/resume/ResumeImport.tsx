"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/ui/UpgradeModal";

export default function ResumeImport() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateData, addExperience, addEducation } = useResumeStore();
  const { isPremium } = useSubscription();

  const handleFile = async (file: File) => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to parse resume");
      }

      const result = await response.json();
      const parsedData = result.data;

      // Update the resume store with parsed data
      updateData({
        name: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        location: parsedData.location || "",
        linkedin: parsedData.linkedin || "",
        website: parsedData.website || "",
        summary: parsedData.summary || "",
        skills: parsedData.skills || [],
      });

      // Add experiences
      parsedData.experience?.forEach((exp: any) => {
        addExperience(exp);
      });

      // Add education
      parsedData.education?.forEach((edu: any) => {
        addEducation(edu);
      });

      // Success - clear any errors
      setError(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Smart PDF Import"
      />
      <div className="mb-6 rounded-lg border border-gray-800 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-blue" />
          <h3 className="text-lg font-semibold text-white">
            Upload Resume or LinkedIn PDF
          </h3>
          <svg
            className="ml-2 h-4 w-4 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-label="LinkedIn"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        {error && (
          <button
            onClick={() => setError(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-brand-blue bg-brand-blue/10"
            : "border-gray-700 bg-slate-800/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-sm text-gray-400">
              AI is parsing your resume... This may take a few seconds.
            </p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <p className="mb-2 text-sm text-gray-300">
              Drag and drop your PDF resume or LinkedIn export here, or
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green"
            >
              Browse Files
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Our AI will extract your information and auto-fill the form. LinkedIn PDF exports work best!
            </p>
          </>
        )}
      </div>
    </div>
    </>
  );
}

