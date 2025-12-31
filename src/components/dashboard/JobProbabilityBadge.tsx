"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, AlertCircle } from "lucide-react";

interface JobProbabilityBadgeProps {
  jobId: string;
  matchScore?: number;
  daysSincePosted?: number;
}

export default function JobProbabilityBadge({
  jobId,
  matchScore,
  daysSincePosted,
}: JobProbabilityBadgeProps) {
  const [probability, setProbability] = useState<{
    probability: number;
    label: "High" | "Medium" | "Low";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (matchScore !== undefined) {
      setIsLoading(true);
      fetch('/api/ai/probability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchScore: matchScore || 50,
          daysSincePosted: daysSincePosted || 0,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setProbability(data);
        })
        .catch((error) => {
          console.error('Error fetching probability:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [jobId, matchScore, daysSincePosted]);

  if (isLoading || !probability) {
    return null;
  }

  const getBadgeColor = () => {
    if (probability.label === "High") {
      return "bg-brand-green/20 border-brand-green/50 text-brand-green";
    } else if (probability.label === "Medium") {
      return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400";
    } else {
      return "bg-gray-500/20 border-gray-500/50 text-gray-400";
    }
  };

  const getIcon = () => {
    if (probability.label === "High") {
      return <Zap className="h-3 w-3" />;
    } else if (probability.label === "Medium") {
      return <TrendingUp className="h-3 w-3" />;
    } else {
      return <AlertCircle className="h-3 w-3" />;
    }
  };

  const isPriority = probability.probability >= 70;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${getBadgeColor()}`}
      >
        {getIcon()}
        <span>{probability.probability}%</span>
      </div>
      {isPriority && (
        <span className="rounded-full bg-red-500/20 border border-red-500/50 px-2 py-0.5 text-xs font-medium text-red-400">
          Priority
        </span>
      )}
    </div>
  );
}


