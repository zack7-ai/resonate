"use client";

import { useState } from "react";
import { Calendar, Target, CheckCircle2, AlertCircle, Loader2, Download, FileText } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Task {
  task: string;
  priority: "High" | "Medium" | "Low";
  timeline: string;
  resources: string[];
}

interface Phase {
  title: string;
  theme: string;
  objectives: string[];
  tasks: Task[];
  milestones: string[];
}

interface Plan {
  summary: string;
  phases: Phase[];
  successMetrics: string[];
  riskMitigation: string[];
}

export default function NinetyDayPlanPage() {
  const [targetRole, setTargetRole] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { data: resumeData } = useResumeStore();
  const { isPremium } = useSubscription();

  const handleGenerate = async () => {
    if (!targetRole.trim()) {
      setError("Please enter a target role");
      return;
    }

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/90-day-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          currentRole,
          targetRole,
          careerGoals,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const result = await response.json();
      setPlan(result.plan);
    } catch (err) {
      console.error("Error generating plan:", err);
      setError(err instanceof Error ? err.message : "Failed to generate plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">90-Day Career Plan</h1>
        <p className="mt-2 text-gray-400">
          Create a strategic 90-day roadmap to achieve your career goals
        </p>
      </div>

      {!plan ? (
        <div className="max-w-3xl">
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Plan Parameters</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Target Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                  placeholder="e.g., Senior Product Manager at Google"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Current Role
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                  placeholder="e.g., Product Manager at Startup"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Career Goals
                </label>
                <textarea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="Describe your career goals and what you want to achieve..."
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !targetRole.trim()}
                className="w-full rounded-lg bg-brand-blue px-6 py-3 text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    Generate 90-Day Plan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-3 text-xl font-semibold text-white">Plan Summary</h2>
            <p className="text-gray-300">{plan.summary}</p>
          </div>

          {/* Phases */}
          {plan.phases.map((phase, phaseIndex) => (
            <div
              key={phaseIndex}
              className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-brand-blue/20 p-2">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{phase.title}</h3>
                  <p className="text-sm text-gray-400">{phase.theme}</p>
                </div>
              </div>

              {/* Objectives */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Objectives
                </h4>
                <ul className="space-y-1">
                  {phase.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <Target className="mt-1 h-4 w-4 flex-shrink-0 text-brand-blue" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tasks */}
              <div className="mb-4">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Key Tasks
                </h4>
                <div className="space-y-3">
                  {phase.tasks.map((task, taskIdx) => (
                    <div
                      key={taskIdx}
                      className="rounded-lg border border-gray-800 bg-slate-800/50 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <p className="flex-1 text-white">{task.task}</p>
                        <span
                          className={`ml-3 rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-medium">Timeline:</span> {task.timeline}
                      </p>
                      {task.resources.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-medium text-gray-500">Resources:</p>
                          <ul className="flex flex-wrap gap-2">
                            {task.resources.map((resource, resIdx) => (
                              <li
                                key={resIdx}
                                className="rounded bg-brand-blue/10 px-2 py-1 text-xs text-brand-blue"
                              >
                                {resource}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Milestones
                </h4>
                <ul className="space-y-2">
                  {phase.milestones.map((milestone, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-brand-green" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Success Metrics */}
          <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <Target className="h-5 w-5 text-brand-green" />
              Success Metrics
            </h3>
            <ul className="space-y-2">
              {plan.successMetrics.map((metric, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-brand-green" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Mitigation */}
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              Risk Mitigation
            </h3>
            <ul className="space-y-2">
              {plan.riskMitigation.map((strategy, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <AlertCircle className="mt-1 h-4 w-4 flex-shrink-0 text-yellow-400" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setPlan(null)}
              className="rounded-lg border border-gray-800 bg-slate-800 px-6 py-2 text-white transition-colors hover:bg-slate-700"
            >
              Create New Plan
            </button>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="90-Day Career Plan"
      />
    </div>
  );
}


