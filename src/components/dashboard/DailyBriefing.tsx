"use client";

import { useMemo } from "react";
import { TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  company: string;
  title: string;
  status: string;
  created_at: string;
}

interface DailyBriefingProps {
  jobs: Job[];
  userName?: string;
}

export default function DailyBriefing({ jobs, userName }: DailyBriefingProps) {
  const router = useRouter();

  // Calculate statistics and recommendations
  const briefing = useMemo(() => {
    const activeJobs = jobs.filter(job => 
      ['applied', 'interview'].includes(job.status.toLowerCase())
    );

    // Find jobs that need follow-up (applied > 3 days ago, status = 'applied')
    const now = new Date();
    const followUpJobs = jobs
      .filter(job => {
        const jobDate = new Date(job.created_at);
        const daysSince = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));
        return job.status.toLowerCase() === 'applied' && daysSince > 3;
      })
      .sort((a, b) => {
        // Sort by date (oldest first - most urgent)
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

    const recommendedAction = followUpJobs.length > 0 ? followUpJobs[0] : null;

    // Count jobs by status
    const appliedCount = jobs.filter(j => j.status.toLowerCase() === 'applied').length;
    const interviewCount = jobs.filter(j => j.status.toLowerCase() === 'interview').length;
    const offerCount = jobs.filter(j => j.status.toLowerCase() === 'offer').length;

    return {
      activeApplications: activeJobs.length,
      appliedCount,
      interviewCount,
      offerCount,
      recommendedAction,
      followUpCount: followUpJobs.length,
    };
  }, [jobs]);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Calculate days since application
  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            {getGreeting()}{userName ? `, ${userName.split(' ')[0]}` : ''}
          </h2>
          <p className="text-sm text-muted-foreground">
            Your career search status
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <div className="text-2xl font-bold text-card-foreground">{briefing.appliedCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Applied</div>
        </div>
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
          <div className="text-2xl font-bold text-warning">{briefing.interviewCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Interviews</div>
        </div>
        <div className="rounded-lg border border-success/30 bg-success/5 p-3">
          <div className="text-2xl font-bold text-success">{briefing.offerCount}</div>
          <div className="text-xs text-muted-foreground mt-1">Offers</div>
        </div>
      </div>

      {/* Recommended Action */}
      {briefing.recommendedAction ? (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-semibold text-card-foreground">Recommended Action</h3>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Follow up with <span className="font-semibold text-card-foreground">{briefing.recommendedAction.company}</span> 
            {' '}(Applied {getDaysSince(briefing.recommendedAction.created_at)} days ago)
          </p>
          <button
            onClick={() => router.push(`/resume/builder?jobId=${briefing.recommendedAction!.id}`)}
            className="flex items-center gap-2 rounded-lg bg-warning/20 border border-warning/50 px-3 py-1.5 text-xs font-medium text-warning transition-colors hover:bg-warning/30"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Take Action
          </button>
        </div>
      ) : briefing.activeApplications > 0 ? (
        <div className="rounded-lg border border-success/30 bg-success/5 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <p className="text-sm text-muted-foreground">
              All caught up! You have {briefing.activeApplications} active application{briefing.activeApplications !== 1 ? 's' : ''} in progress.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            No active applications. Start by saving your first opportunity!
          </p>
        </div>
      )}

      {/* Follow-up Count */}
      {briefing.followUpCount > 0 && briefing.followUpCount !== (briefing.recommendedAction ? 1 : 0) && (
        <div className="mt-3 text-xs text-muted-foreground">
          {briefing.followUpCount - (briefing.recommendedAction ? 1 : 0)} more application{briefing.followUpCount - (briefing.recommendedAction ? 1 : 0) !== 1 ? 's' : ''} need follow-up
        </div>
      )}
    </div>
  );
}

