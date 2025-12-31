"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddJobModal({
  isOpen,
  onClose,
  onSuccess,
}: AddJobModalProps) {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("applied");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !company.trim() || !title.trim()) return;

    setLoading(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supabase.from("jobs").insert({
        user_id: user.id,
        company: company.trim(),
        title: title.trim(),
        status: status,
      });

      if (error) {
        console.error("Error adding job:", error);
        alert("Failed to add job. Please try again.");
      } else {
        setCompany("");
        setTitle("");
        setStatus("applied");
        onSuccess();
      }
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-gray-800 bg-slate-900 p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Target</h2>
          <p className="mt-1 text-sm text-gray-400">
            Log a new job application to track your progress
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Company *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
              placeholder="e.g., Google, Microsoft"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Role / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
              placeholder="e.g., Software Engineer, Product Manager"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-800 bg-slate-800 px-6 py-2 font-semibold text-gray-300 transition-colors hover:bg-slate-700 hover:border-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-blue px-6 py-2 font-semibold text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Target"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

