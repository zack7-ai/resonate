"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert("Please type 'DELETE' to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
      });

      if (response.ok) {
        // Redirect to home page after successful deletion
        router.push("/");
      } else {
        const data = await response.json();
        alert(`Error: ${data.error || "Failed to delete account"}`);
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account");
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-white">Settings</h1>

        <div className="space-y-8">
          {/* Account Information */}
          <section className="rounded-lg border border-gray-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Account Information
            </h2>
            <div className="space-y-2 text-gray-300">
              <p>
                <span className="font-medium text-gray-400">Email:</span>{" "}
                {user?.emailAddresses[0]?.emailAddress}
              </p>
              <p>
                <span className="font-medium text-gray-400">User ID:</span>{" "}
                {user?.id}
              </p>
            </div>
          </section>

          {/* Legal Links */}
          <section className="rounded-lg border border-gray-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Legal
            </h2>
            <div className="space-y-2">
              <a
                href="/legal/terms"
                className="block text-brand-blue hover:text-brand-green transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/legal/privacy"
                className="block text-brand-blue hover:text-brand-green transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </section>

          {/* Delete Account Section */}
          <section className="rounded-lg border border-red-900/50 bg-red-950/20 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-900/50 p-3">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-semibold text-red-400">
                  Danger Zone
                </h2>
                <p className="mb-4 text-gray-300">
                  Permanently delete your account and all associated data. This
                  action cannot be undone and will remove:
                </p>
                <ul className="mb-6 ml-6 list-disc space-y-1 text-gray-400">
                  <li>Your profile and account information</li>
                  <li>All saved resumes</li>
                  <li>All job applications and tracking data</li>
                  <li>All recruiter contacts</li>
                </ul>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-300">
                        Type <span className="font-mono text-red-400">DELETE</span> to
                        confirm:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="DELETE"
                        disabled={isDeleting}
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={
                          isDeleting || deleteConfirmText !== "DELETE"
                        }
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? "Deleting..." : "Confirm Deletion"}
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        disabled={isDeleting}
                        className="rounded-lg border border-gray-700 px-4 py-2 font-semibold text-gray-300 transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


