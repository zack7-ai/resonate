"use client";

import RezPulse from "@/components/ui/RezPulse";
import { MessageSquare } from "lucide-react";

interface RezWidgetProps {
  velocity: number;
  goal: number;
  complianceScore: number;
  applicationsThisWeek: number;
}

export default function RezWidget({
  velocity,
  goal,
  complianceScore,
  applicationsThisWeek,
}: RezWidgetProps) {
  // Mock job count - in production, fetch from actual data
  // For now, we'll use a simple calculation based on velocity
  const activeTargets = applicationsThisWeek || 0;

  // Generate tactical advice based on user data
  const getAdvice = (): string => {
    const remainingApps = goal - applicationsThisWeek;
    const velocityRatio = applicationsThisWeek / goal;
    const complianceRatio = complianceScore / 100;

    if (applicationsThisWeek === 0) {
      return "🚀 Let's get started! Send your first application today to begin building momentum.";
    }

    if (velocityRatio < 0.3 && remainingApps > 0) {
      return `⚡ Velocity is low. Send ${Math.min(remainingApps, 3)} applications today to catch up.`;
    }

    if (velocityRatio >= 0.7 && velocityRatio < 1) {
      return `💪 You're on track! ${remainingApps} more applications this week to hit your goal.`;
    }

    if (velocityRatio >= 1) {
      return `🎯 Goal exceeded! You're crushing it. Consider increasing your goal next week.`;
    }

    if (complianceRatio < 0.6) {
      return `📊 Consistency is key. Try to maintain a steady pace throughout the week.`;
    }

    if (complianceRatio >= 0.8) {
      return `✨ Excellent compliance! Your consistency is paying off. Keep up the momentum!`;
    }

    return "📈 Keep applying consistently. Every application gets you closer to your goal.";
  };

  const advice = getAdvice();

  return (
    <div className="h-full">
      <div className="mb-4">
        <RezPulse 
          status="default" 
          message={`Systems Nominal. Tracking ${activeTargets} Active Target${activeTargets !== 1 ? 's' : ''}.`}
        />
      </div>
      <div className="rounded-lg border border-brand-green/20 bg-brand-green/5 p-4">
        <div className="flex items-start gap-3">
          <MessageSquare className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-green" />
          <p className="text-sm leading-relaxed text-gray-300">{advice}</p>
        </div>
      </div>
    </div>
  );
}

