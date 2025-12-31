"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { resumeDataToText } from "@/utils/resumeToText";

interface AuditResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  actionPlan: string[];
}

export default function AuditWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: resumeData } = useResumeStore();
  const auditTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const runAudit = useCallback(async () => {
    if (!resumeData.name) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resumeText = resumeDataToText(resumeData);

      const response = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run audit');
      }

      const result = await response.json();
      setAuditResult(result);
    } catch (err) {
      console.error('Error running audit:', err);
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setIsLoading(false);
    }
  }, [resumeData]);

  // Auto-run audit when resume data changes (with debounce)
  useEffect(() => {
    if (!resumeData.name) {
      setAuditResult(null);
      return;
    }

    // Clear any existing timeout
    if (auditTimeoutRef.current) {
      clearTimeout(auditTimeoutRef.current);
    }

    // Debounce audit to avoid running on every keystroke
    auditTimeoutRef.current = setTimeout(() => {
      runAudit();
    }, 2000); // Wait 2 seconds after last change

    return () => {
      if (auditTimeoutRef.current) {
        clearTimeout(auditTimeoutRef.current);
      }
    };
  }, [resumeData.name, resumeData.summary, resumeData.experience.length, resumeData.skills?.length, runAudit]);

  const getScoreColor = () => {
    if (!auditResult) return "text-gray-400";
    if (auditResult.score >= 80) return "text-brand-green";
    if (auditResult.score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = () => {
    if (!auditResult) return "bg-gray-500/20";
    if (auditResult.score >= 80) return "bg-brand-green/20";
    if (auditResult.score >= 60) return "bg-yellow-400/20";
    return "bg-red-500/20";
  };

  const getScoreBorderColor = () => {
    if (!auditResult) return "border-gray-700";
    if (auditResult.score >= 80) return "border-brand-green/50";
    if (auditResult.score >= 60) return "border-yellow-400/50";
    return "border-red-500/50";
  };

  const getScoreLabel = () => {
    if (!auditResult) return "No Data";
    if (auditResult.score >= 80) return "Excellent";
    if (auditResult.score >= 60) return "Good";
    if (auditResult.score >= 40) return "Needs Work";
    return "Poor";
  };

  if (!resumeData.name) {
    return null; // Don't show widget if resume is empty
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-brand-blue/20 p-2">
            <Activity className="h-5 w-5 text-brand-blue" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">Resume Health Check</h3>
            {auditResult && (
              <p className="text-xs text-gray-400 mt-0.5">
                Last analyzed: Just now
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Score Display */}
          {auditResult && (
            <div className={`flex items-center gap-2 rounded-lg border ${getScoreBorderColor()} ${getScoreBgColor()} px-3 py-1.5`}>
              <span className={`text-lg font-bold ${getScoreColor()}`}>
                {auditResult.score}
              </span>
              <span className="text-xs text-gray-400">/100</span>
            </div>
          )}
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  runAudit();
                }}
                className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Refresh audit"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </>
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          {isLoading && !auditResult && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
              <span className="ml-2 text-sm text-gray-400">Analyzing resume...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {auditResult && (
            <>
              {/* Score Summary */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Circular Progress */}
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-800"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - auditResult.score / 100)}`}
                      className={getScoreColor()}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${getScoreColor()}`}>
                      {auditResult.score}
                    </span>
                    <span className="text-xs text-gray-400">{getScoreLabel()}</span>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {auditResult.strengths.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-green" />
                    <h4 className="text-sm font-semibold text-white">Strengths</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {auditResult.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-green flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {auditResult.weaknesses.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    <h4 className="text-sm font-semibold text-white">Critical Fixes</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {auditResult.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Plan */}
              {auditResult.actionPlan.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <h4 className="text-sm font-semibold text-white">Action Plan</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {auditResult.actionPlan.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

