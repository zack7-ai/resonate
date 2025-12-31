"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Network } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddJobModal from "./AddJobModal";
import NetworkingModal from "./NetworkingModal";
import EmptyState from "@/components/ui/EmptyState";

interface Job {
  id: string;
  company: string;
  title: string;
  status: string;
  created_at: string;
  job_description_text?: string;
}

export default function ActiveOperations() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJobForNetwork, setSelectedJobForNetwork] = useState<Job | null>(null);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // TEMPORARY: Use API endpoint with service role to show all jobs for testing
      // This bypasses RLS and shows all jobs regardless of user_id
      const response = await fetch('/api/jobs/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const result = await response.json();
      const jobsData = result.jobs || [];

      console.log(`✅ Fetched ${jobsData.length} jobs from API`);
      setJobs(jobsData);
    } catch (error) {
      console.error("❌ Error fetching jobs from API:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "applied":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "interview":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "offer":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">Active Applications</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Track your job applications and opportunities
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Save Opportunity
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            Loading operations...
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="jobs"
            title="No opportunities found"
            description="Start scouting by saving your first opportunity or job posting."
            actionLabel="Save Opportunity"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border/50 transition-colors hover:bg-accent/50"
                  >
                    <td 
                      className="px-4 py-3 text-card-foreground cursor-pointer"
                      onClick={() => router.push(`/resume/builder?jobId=${job.id}`)}
                    >
                      {job.company}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/resume/builder?jobId=${job.id}`}
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                      >
                        {job.title}
                      </Link>
                    </td>
                    <td 
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => router.push(`/resume/builder?jobId=${job.id}`)}
                    >
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusColor(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td 
                      className="px-4 py-3 text-sm text-muted-foreground cursor-pointer"
                      onClick={() => router.push(`/resume/builder?jobId=${job.id}`)}
                    >
                      {formatDate(job.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJobForNetwork(job);
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 hover:border-primary"
                          title="Generate networking messages"
                        >
                          <Network className="h-3.5 w-3.5" />
                          Network
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchJobs();
          setShowAddModal(false);
        }}
      />

      {selectedJobForNetwork && (
        <NetworkingModal
          isOpen={!!selectedJobForNetwork}
          onClose={() => setSelectedJobForNetwork(null)}
          jobId={selectedJobForNetwork.id}
          jobTitle={selectedJobForNetwork.title}
          company={selectedJobForNetwork.company}
          jobDescription={selectedJobForNetwork.job_description_text}
        />
      )}
    </>
  );
}
