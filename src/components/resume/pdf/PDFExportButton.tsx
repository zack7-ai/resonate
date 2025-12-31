"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ResumeDocument } from "@/components/pdf/ResumeDocument";
import { ResumeData } from "@/stores/useResumeStore";
import { Download, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface PDFExportButtonProps {
  resumeData: ResumeData;
  disabled?: boolean;
  onUpgradeRequired?: () => void;
}

export default function PDFExportButton({
  resumeData,
  disabled = false,
  onUpgradeRequired,
}: PDFExportButtonProps) {
  const { isPremium } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isPremium) {
      e.preventDefault();
      setShowUpgradeModal(true);
      if (onUpgradeRequired) {
        onUpgradeRequired();
      }
      return;
    }
  };

  const fileName = `${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`;

  if (!isPremium) {
    return (
      <>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          feature="Executive PDF Export"
        />
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <Download className="h-4 w-4" />
          Export to PDF
        </button>
      </>
    );
  }

  return (
    <>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Executive PDF Export"
      />
      <PDFDownloadLink
        document={
          <ResumeDocument
            data={resumeData}
            subscriptionStatus="pro"
          />
        }
        fileName={fileName}
        className="flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleClick}
      >
        {({ loading }) => (
          <>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Preparing Document...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export to PDF</span>
              </>
            )}
          </>
        )}
      </PDFDownloadLink>
    </>
  );
}

