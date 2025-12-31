"use client";

import { useState, useEffect } from "react";
import { Radar, MapPin, DollarSign, ExternalLink, Save, Loader2, Target } from "lucide-react";
import Button from "@/components/ui/Button";
import { useResumeStore } from "@/stores/useResumeStore";
import { useUser } from "@clerk/nextjs";

interface RecommendedJob {
  job_id: string;
  title: string;
  employer_name: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  apply_link?: string;
  match_score: number;
  description?: string;
  employment_type?: string;
  logo?: string;
  fit_reason?: string; // AI-generated fit explanation
  extracted_salary?: number; // Extracted salary from AI
}

interface JobRadarResponse {
  jobs: RecommendedJob[];
  needsProfile: boolean;
  message?: string;
}

export default function JobRadar() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
  const [needsProfile, setNeedsProfile] = useState(false);
  const { data: resumeData } = useResumeStore();
  const { user } = useUser();

  useEffect(() => {
    fetchRecommendations();
  }, [resumeData?.skills]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs/recommend");
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data: JobRadarResponse = await response.json();
      setJobs(data.jobs || []);
      setNeedsProfile(data.needsProfile || false);
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (job: RecommendedJob) => {
    setSavingJobId(job.job_id);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: job.employer_name,
          title: job.title,
          job_description_text: job.description || "",
          status: "saved",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      // Show success feedback (could use a toast here)
      alert(`Saved "${job.title}" at ${job.employer_name} to your operations!`);
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job. Please try again.");
    } finally {
      setSavingJobId(null);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) {
      return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
    }
    if (min) return `$${(min / 1000).toFixed(0)}k+`;
    if (max) return `Up to $${(max / 1000).toFixed(0)}k`;
    return null;
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Scanning the market...</span>
        </div>
      </div>
    );
  }

  if (needsProfile) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-card-foreground">
            Complete Your Profile
          </h3>
          <p className="mb-6 text-muted-foreground">
            Add your skills to your resume to activate Radar recommendations.
          </p>
          <a href="/resume/builder">
            <Button>
              Go to Resume Builder
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <Radar className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-xl font-semibold text-card-foreground">
            No Recommendations Found
          </h3>
          <p className="text-muted-foreground">
            Try updating your skills or job preferences to get better matches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Radar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">The Radar</h2>
            <p className="text-sm text-muted-foreground">
              AI-powered job recommendations based on your profile
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4">
          {jobs.map((job) => (
            <div
              key={job.job_id}
              className="group relative min-w-[320px] max-w-[320px] flex-shrink-0 rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              {/* Match Score Badge */}
              <div className="absolute right-3 top-3">
                <div className={`rounded-full border-2 border-current px-2.5 py-0.5 text-xs font-bold ${getMatchColor(job.match_score)}`}>
                  {job.match_score}%
                </div>
              </div>

              {/* Company Logo Placeholder */}
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={job.employer_name}
                  className="mb-3 h-12 w-12 rounded object-contain"
                />
              ) : (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded bg-muted text-lg font-bold text-muted-foreground">
                  {job.employer_name.charAt(0)}
                </div>
              )}

              {/* Job Title */}
              <h3 className="mb-1 pr-16 text-lg font-semibold text-card-foreground line-clamp-2">
                {job.title}
              </h3>

              {/* Company Name */}
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                {job.employer_name}
              </p>

              {/* Location */}
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>

              {/* Salary */}
              {formatSalary(job.salary_min, job.salary_max) && (
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
              )}

              {/* Employment Type */}
              {job.employment_type && (
                <div className="mb-4">
                  <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {job.employment_type === "REMOTE" ? "Remote" : "Full-time"}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSaveJob(job)}
                  disabled={savingJobId === job.job_id}
                >
                  {savingJobId === job.job_id ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3" />
                      Save
                    </>
                  )}
                </Button>
                {job.apply_link && (
                  <a
                    href={job.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-lg border border-border bg-transparent px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      {jobs.length > 3 && (
        <div className="mt-4 text-center text-xs text-muted-foreground">
          Scroll horizontally to see more recommendations
        </div>
      )}
    </div>
  );
}

