"use client";

import ActiveOperations from "@/components/dashboard/ActiveOperations";

export default function JobsPage() {
  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Scout</h1>
        <p className="mt-2 text-gray-400">
          Track and manage your job applications and opportunities
        </p>
      </div>
      <ActiveOperations />
    </div>
  );
}

