"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useReactToPrint } from "react-to-print";
import { FileText, Download, Loader2 } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import Button from "@/components/ui/Button";
import PrintLayout from "@/components/report/PrintLayout";
import MarketValueChart from "@/components/dashboard/MarketValueChart";

interface ReportData {
  jobs: any[];
  userName: string;
  skills?: string[];
}

export default function ReportPage() {
  const { user } = useUser();
  const { data: resumeData } = useResumeStore();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        const [jobsResponse] = await Promise.all([
          fetch("/api/jobs/recommend"),
        ]);

        const jobsData = await jobsResponse.json();
        
        setReportData({
          jobs: jobsData.jobs || [],
          userName: user?.fullName || resumeData?.name || "User",
          skills: resumeData?.skills || [],
        });
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReportData();
    }
  }, [user, resumeData]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Career_Intelligence_Report_${reportData?.userName || "User"}_${new Date().toISOString().split("T")[0]}`,
    pageStyle: `
      @page {
        margin: 0.75in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const handleDownloadPDF = () => {
    handlePrint();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Generating report...</span>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Failed to load report data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Career Intelligence Report
            </h1>
            <p className="mt-2 text-muted-foreground">
              Market analysis and strategic opportunities for {reportData?.userName || "User"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <FileText className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download Official PDF
            </Button>
          </div>
        </div>

        {/* Hidden Print Layout (for PDF export) */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          {reportData && (
            <PrintLayout ref={printRef} data={reportData} />
          )}
        </div>

        {/* Visible Report Content (for screen viewing) */}
        {reportData && (
          <div className="space-y-8">
            {/* Section 1: Market Value Chart */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Market Value Analysis
              </h2>
              <MarketValueChart jobs={reportData.jobs} />
            </section>

            {/* Section 2: Top 3 Strategic Matches */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Top 3 Strategic Matches
              </h2>
              {reportData.jobs.slice(0, 3).length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {reportData.jobs.slice(0, 3).map((job) => (
                    <div
                      key={job.job_id}
                      className="rounded-lg border border-border bg-card p-6 shadow-sm"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-card-foreground">
                            {job.title}
                          </h3>
                          <p className="text-sm font-medium text-muted-foreground">
                            {job.employer_name}
                          </p>
                        </div>
                        <div className="rounded-full border-2 border-success px-2.5 py-0.5 text-xs font-bold text-success">
                          {job.match_score}%
                        </div>
                      </div>

                      <div className="mb-4 space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong>Location:</strong> {job.location}
                        </p>
                        {job.salary_min && job.salary_max && (
                          <p className="text-muted-foreground">
                            <strong>Salary:</strong> ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                          </p>
                        )}
                        {job.extracted_salary && (
                          <p className="text-muted-foreground">
                            <strong>Salary:</strong> ${(job.extracted_salary / 1000).toFixed(0)}k
                          </p>
                        )}
                      </div>

                      {job.fit_reason && (
                        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <p className="text-xs font-medium text-card-foreground mb-1">
                            Why You&apos;re a Match:
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {job.fit_reason}
                          </p>
                        </div>
                      )}

                      {job.apply_link && (
                        <a
                          href={job.apply_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          View Job →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    No job recommendations available. Complete your profile to see matches.
                  </p>
                </div>
              )}
            </section>

            {/* Section 3: Skill Gap Analysis */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Skill Gap Analysis
              </h2>
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                {reportData.skills && reportData.skills.length > 0 ? (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-card-foreground">
                      Your Current Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {reportData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      These skills are being matched against current job market requirements.
                      Consider adding skills that appear frequently in your target roles.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      No skills listed in your resume.
                    </p>
                    <a href="/resume/builder">
                      <Button variant="outline">
                        Add Skills to Resume
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

