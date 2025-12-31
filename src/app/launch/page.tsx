"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Upload, Download, Target, CheckCircle2, ArrowRight } from "lucide-react";
import RezPulse from "@/components/ui/RezPulse";

type OnboardingStep = "upload" | "extension" | "goal";

export default function LaunchPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("upload");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [extensionInstalled, setExtensionInstalled] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  // Redirect to dashboard if onboarding already completed
  useEffect(() => {
    if (!isLoaded) return;
    const hasCompletedOnboarding =
      user?.publicMetadata?.onboarding_completed === true;
    if (hasCompletedOnboarding) {
      router.push("/dashboard");
    }
  }, [user, isLoaded, router]);

  const handleUploadResume = () => {
    // In a real app, this would handle file upload
    setResumeUploaded(true);
    setTimeout(() => setCurrentStep("extension"), 1000);
  };

  const handleExtensionInstall = () => {
    setExtensionInstalled(true);
    setTimeout(() => setCurrentStep("goal"), 1000);
  };

  const handleSetGoal = async () => {
    // In a real app, save the goal to the database and mark onboarding as complete
    // For now, we'll use Clerk's publicMetadata to track onboarding completion
    // Note: This would typically be done via an API route
    
    // Mark onboarding as completed
    // await fetch('/api/user/complete-onboarding', { method: 'POST', body: JSON.stringify({ weeklyGoal }) });
    
    router.push("/dashboard");
  };

  const handleSkipToBuilder = () => {
    router.push("/resume/builder");
  };

  const steps = [
    { id: "upload", label: "Upload Resume", completed: resumeUploaded },
    { id: "extension", label: "Install Extension", completed: extensionInstalled },
    { id: "goal", label: "Set Goal", completed: false },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-brand-dark text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <RezPulse status="default" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">
            Initialize Launch Sequence
          </h1>
          <p className="text-lg text-gray-400">
            Let's get your career command center up and running
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      step.completed
                        ? "border-brand-green bg-brand-green text-white"
                        : index === currentStepIndex
                        ? "border-brand-blue bg-brand-blue text-white"
                        : "border-gray-700 bg-slate-900 text-gray-500"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      index === currentStepIndex
                        ? "text-white"
                        : step.completed
                        ? "text-brand-green"
                        : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${
                      step.completed ? "bg-brand-green" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg border border-gray-800 bg-slate-900/50 p-8">
          {currentStep === "upload" && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-brand-blue/20 p-6">
                  <Upload className="h-12 w-12 text-brand-blue" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                Upload Your Resume
              </h2>
              <p className="mb-8 text-gray-400">
                Upload your existing resume to get started, or build one from
                scratch.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleUploadResume}
                  className="flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-green"
                >
                  <Upload className="h-5 w-5" />
                  Upload Resume
                </button>
                <button
                  onClick={handleSkipToBuilder}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-slate-800 px-6 py-3 font-semibold text-gray-300 transition-colors hover:bg-slate-700"
                >
                  Build from Scratch
                </button>
              </div>
            </div>
          )}

          {currentStep === "extension" && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-brand-blue/20 p-6">
                  <Download className="h-12 w-12 text-brand-blue" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                Install the Hunter Extension
              </h2>
              <p className="mb-4 text-gray-400">
                Install our Chrome extension to auto-fill applications and
                track your job search.
              </p>
              <div className="mb-8 rounded-lg border border-gray-700 bg-slate-800 p-4 text-left">
                <p className="mb-2 text-sm font-medium text-gray-300">
                  Chrome Web Store Link:
                </p>
                <code className="text-sm text-brand-blue">
                  chrome://extensions (Coming Soon)
                </code>
              </div>
              <button
                onClick={handleExtensionInstall}
                className="flex items-center gap-2 rounded-lg bg-brand-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-green"
              >
                I've Installed It
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {currentStep === "goal" && (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-brand-blue/20 p-6">
                  <Target className="h-12 w-12 text-brand-blue" />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                Set Your Weekly Goal
              </h2>
              <p className="mb-8 text-gray-400">
                How many applications do you want to send per week?
              </p>
              <div className="mb-8">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="mb-4 w-full"
                />
                <div className="text-4xl font-bold text-brand-green">
                  {weeklyGoal} applications/week
                </div>
              </div>
              <button
                onClick={handleSetGoal}
                className="flex items-center gap-2 rounded-lg bg-brand-green px-8 py-3 font-semibold text-white transition-colors hover:bg-green-500"
              >
                Complete Setup
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Skip Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
}

