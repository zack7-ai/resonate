"use client";

import { useEffect, useState } from "react";
import { Target, AlertCircle, CheckCircle2 } from "lucide-react";
import { ResumeData } from "@/stores/useResumeStore";

interface MatchScoreWidgetProps {
  resumeData: ResumeData;
  jobDescription?: string;
}

interface MatchResult {
  score: number;
  missingKeywords: string[];
  advice: string;
}

export default function MatchScoreWidget({
  resumeData,
  jobDescription,
}: MatchScoreWidgetProps) {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobDescription && resumeData.name) {
      calculateMatchScore();
    } else {
      setMatchResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobDescription, resumeData.name]);

  const calculateMatchScore = async () => {
    if (!jobDescription) return;

    setLoading(true);
    setError(null);

    try {
      // Convert resume data to text for analysis
      const resumeText = `
Name: ${resumeData.name}
Email: ${resumeData.email || ''}
Summary: ${resumeData.summary || ''}

Experience:
${resumeData.experience.map(exp => `
${exp.title} at ${exp.company}
${exp.description.join(' ')}
`).join('\n')}

Education:
${resumeData.education.map(edu => `${edu.degree} in ${edu.field || ''} from ${edu.school}`).join(', ')}

Skills: ${resumeData.skills?.join(', ') || ''}
      `.trim();

      const response = await fetch('/api/ai/match-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate match score');
      }

      const result = await response.json();
      setMatchResult(result);
    } catch (err) {
      console.error('Match score error:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate match');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-brand-green';
    if (score >= 50) return 'text-yellow-400';
    return 'text-brand-alert';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-brand-green/20 border-brand-green/50';
    if (score >= 50) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-brand-alert/20 border-brand-alert/50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-5 w-5 text-brand-green" />;
    if (score >= 50) return <Target className="h-5 w-5 text-yellow-400" />;
    return <AlertCircle className="h-5 w-5 text-brand-alert" />;
  };

  if (!jobDescription) {
    return (
      <div className="rounded-lg border border-gray-800 bg-slate-900/50 p-4">
        <p className="text-sm text-gray-400">
          Select a job to see match score
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border p-4 ${matchResult ? getScoreBgColor(matchResult.score) : 'border-gray-800 bg-slate-900/50'}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-brand-blue" />
          <h3 className="font-semibold text-white">Match Score</h3>
        </div>
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent" />
        )}
      </div>

      {error && (
        <p className="mb-2 text-sm text-red-400">{error}</p>
      )}

      {matchResult && (
        <>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative">
              <svg className="h-16 w-16 -rotate-90 transform">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-gray-800"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${(matchResult.score / 100) * 175.93} 175.93`}
                  className={getScoreColor(matchResult.score)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${getScoreColor(matchResult.score)}`}>
                  {matchResult.score}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                {getScoreIcon(matchResult.score)}
                <span className={`text-sm font-medium ${getScoreColor(matchResult.score)}`}>
                  {matchResult.score >= 80
                    ? 'Excellent Match'
                    : matchResult.score >= 50
                    ? 'Good Match'
                    : 'Needs Work'}
                </span>
              </div>
              <p className="text-xs text-gray-400">{matchResult.advice}</p>
            </div>
          </div>

          {matchResult.missingKeywords.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase text-gray-400">
                Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingKeywords.slice(0, 10).map((keyword, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-gray-800 px-2 py-1 text-xs text-gray-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!matchResult && !loading && !error && (
        <p className="text-sm text-gray-400">Click to calculate match score</p>
      )}
    </div>
  );
}

