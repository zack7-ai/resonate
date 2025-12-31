"use client";

import dynamic from "next/dynamic";
import { ResumeDocument } from "@/components/pdf/ResumeDocument";
import { useResumeStore } from "@/stores/useResumeStore";
import { useUser } from "@clerk/nextjs";

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-slate-400">
        Initializing Bennett Engine...
      </div>
    ),
  }
);

export default function ResumePreview() {
  const { data } = useResumeStore();
  const { user } = useUser();

  // Get subscription status from user metadata or default to 'free'
  // This would typically come from your database
  const subscriptionStatus = (user?.publicMetadata?.subscription_status as string) || "free";

  return (
    <div className="h-full w-full bg-gray-100">
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <ResumeDocument data={data} subscriptionStatus={subscriptionStatus} />
      </PDFViewer>
    </div>
  );
}

