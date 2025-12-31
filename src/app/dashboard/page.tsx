"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import VelocityChart7Days from "@/components/dashboard/VelocityChart7Days";
import ComplianceScore from "@/components/dashboard/ComplianceScore";
import RezWidget from "@/components/dashboard/RezWidget";
import ActiveOperations from "@/components/dashboard/ActiveOperations";
import DailyBriefing from "@/components/dashboard/DailyBriefing";
import JobRadar from "@/components/dashboard/JobRadar";
import MarketValueChart from "@/components/dashboard/MarketValueChart";

// Generate mock data for last 7 days
const generateLast7DaysData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  // Generate data for last 7 days
  return days.map((day, index) => ({
    day,
    applications: Math.floor(Math.random() * 8), // 0-7 applications per day
  }));
};

// Calculate compliance score based on consistency (mock for now)
const calculateComplianceScore = (): number => {
  // Mock score - in production, calculate from actual data
  return 84;
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [velocityData] = useState(generateLast7DaysData());
  const [complianceScore] = useState(calculateComplianceScore());
  const [applicationsThisWeek] = useState(
    velocityData.reduce((sum, d) => sum + d.applications, 0)
  );
  const [jobs, setJobs] = useState<any[]>([]);
  const [radarJobs, setRadarJobs] = useState<any[]>([]);

  // Prevent hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch jobs for DailyBriefing
  useEffect(() => {
    if (isMounted && user) {
      fetch('/api/jobs/list')
        .then((res) => res.json())
        .then((result) => {
          if (result.jobs) {
            setJobs(result.jobs);
          }
        })
        .catch((error) => {
          console.error('Error fetching jobs:', error);
        });

      // Fetch Radar jobs for Market Value Chart
      fetch('/api/jobs/recommend')
        .then((res) => res.json())
        .then((data) => {
          setRadarJobs(data.jobs || []);
        })
        .catch((err) => {
          console.error('Error fetching radar jobs:', err);
          setRadarJobs([]);
        });
    }
  }, [isMounted, user]);

  // Redirect to launch if onboarding not completed
  // TEMPORARILY DISABLED FOR TESTING - Allow access to dashboard regardless of onboarding status
  // useEffect(() => {
  //   if (!isLoaded) return;
  //   const hasCompletedOnboarding =
  //     user?.publicMetadata?.onboarding_completed === true;
  //   if (!hasCompletedOnboarding) {
  //     router.push("/launch");
  //   }
  // }, [user, isLoaded, router]);

  // Prevent hydration mismatch by rendering nothing until mounted
  if (!isMounted || !isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Executive Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back. Your market positioning is active.
          </p>
        </div>

        {/* Daily Briefing */}
        <div className="mb-8">
          <DailyBriefing jobs={jobs} userName={user?.fullName || undefined} />
        </div>

        {/* Main Grid - 3 Columns */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Widget 1: Velocity Tracker (Top Left) */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">
                Velocity Tracker
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Applications Sent (Last 7 Days)
              </p>
              <div className="h-64">
                <VelocityChart7Days data={velocityData} />
              </div>
            </div>
          </div>

          {/* Widget 2: Compliance Score (Top Middle) */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">
                Compliance Score
              </h2>
              <div className="flex items-center justify-center">
                <ComplianceScore score={complianceScore} trend="up" />
              </div>
            </div>
          </div>

          {/* Widget 3: Rez Tactical Advisor (Top Right) */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <RezWidget
                velocity={applicationsThisWeek}
                goal={20} // Weekly goal (mock)
                complianceScore={complianceScore}
                applicationsThisWeek={applicationsThisWeek}
              />
            </div>
          </div>
        </div>

        {/* The Radar - Job Recommendations */}
        <div className="mt-6">
          <JobRadar />
        </div>

        {/* Widget 4: Active Operations (Bottom / Full Width) */}
        <div className="mt-6">
          <ActiveOperations />
        </div>
      </div>
    </div>
  );
}
