"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ComplianceScoreProps {
  score: number;
  trend?: "up" | "down" | "stable";
}

export default function ComplianceScore({
  score,
  trend = "stable",
}: ComplianceScoreProps) {
  const getScoreColor = () => {
    if (score >= 80) return "text-brand-green";
    if (score >= 60) return "text-yellow-400";
    return "text-brand-alert";
  };

  const getScoreBgColor = () => {
    if (score >= 80) return "bg-brand-green/20 border-brand-green/50";
    if (score >= 60) return "bg-yellow-400/20 border-yellow-400/50";
    return "bg-brand-alert/20 border-brand-alert/50";
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-brand-green" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-brand-alert" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  // Calculate circumference for circular progress
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg className="h-32 w-32 transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={
              score >= 80
                ? "#4ADE80"
                : score >= 60
                ? "#FACC15"
                : "#EF4444"
            }
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-3xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          <div className="text-xs text-gray-400">/ 100</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-300">
          Compliance Score
        </span>
        {getTrendIcon()}
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Consistency in meeting your goals
      </p>
    </div>
  );
}


