"use client";

import ResumeForm from "@/components/resume/ResumeForm";
import ResumeImport from "@/components/resume/ResumeImport";
import ResumePreview from "@/components/resume/ResumePreview";
import MatchScoreWidget from "@/components/resume/MatchScoreWidget";
import PDFExportButton from "@/components/resume/pdf/PDFExportButton";
import TargetAnalysisPanel from "@/components/resume/TargetAnalysisPanel";
import AuditWidget from "@/components/resume/AuditWidget";
import { useResumeStore } from "@/stores/useResumeStore";
import RezPulse from "@/components/ui/RezPulse";
import ErrorModal from "@/components/ui/ErrorModal";
import SuccessModal from "@/components/ui/SuccessModal";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { checkFTQ, FTQResult } from "@/utils/ftqChecker";
import { resumeDataToText } from "@/utils/resumeToText";
import { useState, useEffect, Suspense, useCallback } from "react";
import { ShieldCheck, Sparkles, X, Zap, Loader2, Scan } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";

interface Job {
  id: string;
  company: string;
  title: string;
  job_description_text?: string;
}

function ResumeBuilderContent() {
  const [ftqResult, setFtqResult] = useState<FTQResult | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string>("this feature");
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [keywordAnalysis, setKeywordAnalysis] = useState<{
    matchedKeywords: string[];
    missingKeywords: string[];
    score: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { data, updateData, updateExperience } = useResumeStore();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { isPremium } = useSubscription();

  // Fetch job details if jobId is present
  useEffect(() => {
    if (jobId) {
      setLoadingJob(true);
      fetch(`/api/jobs/${jobId}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.job) {
            setCurrentJob(result.job);
          }
        })
        .catch((error) => {
          console.error("Error fetching job:", error);
        })
        .finally(() => {
          setLoadingJob(false);
        });
    } else {
      setCurrentJob(null);
      setKeywordAnalysis(null);
    }
  }, [jobId]);

  // Analyze keyword gap when job and resume data are available
  const handleAnalyzeGap = useCallback(async () => {
    if (!currentJob?.job_description_text || !data.name) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const resumeText = resumeDataToText(data);
      
      const response = await fetch('/api/ai/analyze-gap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription: currentJob.job_description_text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze keyword gap');
      }

      const result = await response.json();
      setKeywordAnalysis({
        matchedKeywords: result.matchedKeywords || [],
        missingKeywords: result.missingKeywords || [],
        score: result.score || 0,
      });
    } catch (error) {
      console.error('Error analyzing keyword gap:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentJob?.job_description_text, data]);

  // Auto-analyze when job description is loaded and resume has content
  useEffect(() => {
    if (currentJob?.job_description_text && data.name && !keywordAnalysis && !isAnalyzing) {
      const timer = setTimeout(() => {
        handleAnalyzeGap();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentJob?.job_description_text, data.name, keywordAnalysis, isAnalyzing, handleAnalyzeGap]);

  const handleFTQCheck = () => {
    const result = checkFTQ(data, currentJob?.job_description_text);
    setFtqResult(result);

    if (result.passed) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  const handleUpgradeRequired = () => {
    setUpgradeFeature("Export PDF");
    setShowUpgradeModal(true);
  };

  const handleAIRewrite = () => {
    if (!isPremium) {
      setUpgradeFeature("AI Rewriting");
      setShowUpgradeModal(true);
      return;
    }
    alert("AI Rewriting feature coming soon!");
  };

  const handleGlobalOptimize = async () => {
    if (!currentJob?.job_description_text || !data.name) {
      alert('Please select a job and ensure your resume has content');
      return;
    }

    setIsOptimizing(true);

    try {
      const response = await fetch('/api/ai/optimize-full', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentResume: data,
          jobDescription: currentJob.job_description_text,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize resume');
      }

      const result = await response.json();
      const { optimizedResume } = result;

      if (optimizedResume.summary) {
        updateData({ summary: optimizedResume.summary });
      }

      optimizedResume.experience?.forEach((exp: any, idx: number) => {
        const originalExp = data.experience[idx];
        if (originalExp && exp.description) {
          updateExperience(originalExp.id, { description: exp.description });
        }
      });

      alert(`Resume aligned to ${currentJob.company}. Summary and keywords updated.`);
      // Re-analyze after optimization
      setKeywordAnalysis(null);
      setTimeout(() => handleAnalyzeGap(), 1000);
    } catch (error) {
      console.error('Error optimizing resume:', error);
      alert(error instanceof Error ? error.message : 'Failed to optimize resume');
    } finally {
      setIsOptimizing(false);
    }
  };

  const getRezPulseStatus = () => {
    if (loadingJob) return "active";
    if (ftqResult?.passed) return "success";
    if (ftqResult && !ftqResult.passed) return "error";
    return currentJob ? "active" : "idle";
  };

  const getRezPulseMessage = () => {
    if (loadingJob) return "Loading target...";
    if (currentJob) {
      return `Target Locked: ${currentJob.company}. Analyzing fit...`;
    }
    return "Awaiting Mission Objective.";
  };

  // Determine if we should show split-screen layout (when jobId is present)
  const showSplitScreen = !!jobId && !!currentJob;

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {showSplitScreen ? (
        <>
          {/* Left Panel - Target Analysis */}
          <div className="w-full border-b border-border lg:w-1/2 lg:border-b-0 lg:border-r">
            {keywordAnalysis ? (
              <TargetAnalysisPanel
                jobDescription={currentJob.job_description_text || ""}
                matchedKeywords={keywordAnalysis.matchedKeywords}
                missingKeywords={keywordAnalysis.missingKeywords}
                matchScore={keywordAnalysis.score}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center border-r border-border bg-card p-6">
                <div className="text-center">
                  <Scan className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">Ready to Analyze</h3>
                  <p className="mb-4 text-muted-foreground">
                    Click the button below to analyze keyword matching
                  </p>
                  <button
                    onClick={handleAnalyzeGap}
                    disabled={isAnalyzing || !data.name}
                    className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Scan className="h-4 w-4" />
                        Scan Keywords
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Resume Form Editor (Split-Screen Mode) */}
          <div className="w-full overflow-y-auto bg-background lg:w-1/2">
            <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    Aligning for: <span className="text-primary">{currentJob.title}</span> @{" "}
                    <span className="text-success">{currentJob.company}</span>
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tailoring resume for this specific role
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleGlobalOptimize}
                    disabled={isOptimizing || !data.name}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-success px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Auto-align resume to this job"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing Market Fit...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        <span>✨ Auto-Align to Job</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <AuditWidget />
              <ResumeImport />
            </div>
            <div className="px-6 pb-6">
              <ResumeForm 
                jobDescription={currentJob.job_description_text}
                jobTitle={currentJob.title}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Left Panel - Form Editor (Normal Layout) */}
          <div className="w-full border-b border-border bg-background overflow-y-auto lg:w-1/2 lg:border-b-0 lg:border-r">
            <div className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Fill in your information and see live preview
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <RezPulse status={getRezPulseStatus()} message={getRezPulseMessage()} />
                  {ftqResult && (
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        ftqResult.passed
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {ftqResult.score}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <AuditWidget />
              <ResumeImport />
            </div>
            <div className="px-6 pb-6">
              <ResumeForm 
                jobDescription={currentJob?.job_description_text}
                jobTitle={currentJob?.title}
              />
            </div>
          </div>

          {/* Right Panel - PDF Preview (Normal Layout) */}
          <div className="w-full bg-muted lg:w-1/2">
            <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">Live Preview</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFTQCheck}
                    className="flex items-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Run FTQ Check
                  </button>

                  {ftqResult?.passed ? (
                    <PDFExportButton
                      resumeData={data}
                      disabled={false}
                      onUpgradeRequired={handleUpgradeRequired}
                    />
                  ) : (
                    <button
                      onClick={handleFTQCheck}
                      disabled={false}
                      className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-50"
                      title="Run FTQ Check first"
                    >
                      Export to PDF
                    </button>
                  )}

                  <button
                    onClick={handleAIRewrite}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isPremium
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                    title={!isPremium ? "AI Rewriting (Premium feature)" : "AI Rewriting"}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Rewrite
                  </button>
                </div>
              </div>
            </div>
            <div className="h-[calc(100vh-73px)] w-full">
              <ResumePreview />
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {ftqResult && (
        <>
          <ErrorModal
            isOpen={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            errors={ftqResult.errors}
            score={ftqResult.score}
          />
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            score={ftqResult.score}
          />
        </>
      )}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
      />
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background text-foreground">Loading...</div>}>
      <ResumeBuilderContent />
    </Suspense>
  );
}
