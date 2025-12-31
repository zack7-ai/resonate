"use client";

import { Target, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface TargetAnalysisPanelProps {
  jobDescription: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchScore?: number;
}

export default function TargetAnalysisPanel({
  jobDescription,
  matchedKeywords,
  missingKeywords,
  matchScore,
}: TargetAnalysisPanelProps) {
  // Calculate match percentage
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  const matchPercentage = totalKeywords > 0 
    ? Math.round((matchedKeywords.length / totalKeywords) * 100)
    : 0;

  // Create highlighted text components
  const renderHighlightedText = () => {
    if (!jobDescription) return jobDescription;

    // Create a simple approach: replace keywords with highlighted spans
    let text = jobDescription;
    const parts: Array<{ text: string; type: 'matched' | 'missing' | 'normal'; key: string }> = [];
    let lastIndex = 0;
    const allKeywords = [
      ...matchedKeywords.map(k => ({ keyword: k, type: 'matched' as const })),
      ...missingKeywords.map(k => ({ keyword: k, type: 'missing' as const })),
    ];

    // Find all keyword positions
    const matches: Array<{ start: number; end: number; type: 'matched' | 'missing'; keyword: string }> = [];
    
    allKeywords.forEach(({ keyword, type }) => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        // Check if already matched (matched takes priority)
        const matchIndex = match.index;
        const matchLength = match[0].length;
        const existingMatch = matches.find(m => 
          matchIndex >= m.start && matchIndex < m.end
        );
        if (!existingMatch || (existingMatch.type === 'missing' && type === 'matched')) {
          if (existingMatch) {
            matches.splice(matches.indexOf(existingMatch), 1);
          }
          matches.push({
            start: matchIndex,
            end: matchIndex + matchLength,
            type,
            keyword: match[0],
          });
        }
      }
    });

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build parts array
    matches.forEach((match, idx) => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push({
          text: text.substring(lastIndex, match.start),
          type: 'normal',
          key: `normal-${lastIndex}`,
        });
      }
      
      // Add matched keyword
      parts.push({
        text: match.keyword,
        type: match.type,
        key: `${match.type}-${match.start}-${idx}`,
      });
      
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.substring(lastIndex),
        type: 'normal',
        key: `normal-${lastIndex}`,
      });
    }

    // If no matches, return original text
    if (parts.length === 0) {
      return <span>{text}</span>;
    }

    // Render parts
    return (
      <>
        {parts.map((part) => {
          if (part.type === 'normal') {
            return <span key={part.key}>{part.text}</span>;
          }
          return (
            <mark
              key={part.key}
              className={`px-1 py-0.5 rounded ${
                part.type === 'matched'
                  ? 'bg-success/30 text-success border border-success/50'
                  : 'bg-destructive/30 text-destructive border border-destructive/50'
              }`}
            >
              {part.text}
            </mark>
          );
        })}
      </>
    );
  };

  const getScoreColor = () => {
    if (matchPercentage >= 80) return "text-success";
    if (matchPercentage >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBgColor = () => {
    if (matchPercentage >= 80) return "bg-success/20";
    if (matchPercentage >= 60) return "bg-warning/20";
    return "bg-destructive/20";
  };

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Target Analysis</h2>
            <p className="text-sm text-muted-foreground">Job description keyword matching</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Keyword Match</span>
            <span className={`font-bold ${getScoreColor()}`}>
              {matchPercentage}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-500 ${getScoreBgColor()} ${getScoreColor()}`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Keyword Summary */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-success/30 bg-success/5 p-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Matched</span>
            </div>
            <p className="mt-1 text-lg font-bold text-success">
              {matchedKeywords.length}
            </p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-muted-foreground">Missing</span>
            </div>
            <p className="mt-1 text-lg font-bold text-destructive">
              {missingKeywords.length}
            </p>
          </div>
        </div>
      </div>

      {/* Job Description Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Job Description
          </h3>
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {renderHighlightedText()}
            </div>
          </div>
        </div>

        {/* Keywords Lists */}
        <div className="space-y-4">
          {/* Matched Keywords */}
          {matchedKeywords.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" />
                Matched Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedKeywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-success/20 border border-success/50 px-3 py-1 text-xs font-medium text-success"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {missingKeywords.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-destructive">
                <XCircle className="h-4 w-4" />
                Missing Keywords
              </h4>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="mb-2 flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-warning" />
                  <p className="text-xs text-muted-foreground">
                    Add these keywords to your resume to improve match score
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-destructive/20 border border-destructive/50 px-3 py-1 text-xs font-medium text-destructive"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

