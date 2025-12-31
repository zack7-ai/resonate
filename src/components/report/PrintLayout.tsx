"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import Logo from "@/components/ui/Logo";

// Dynamically import MarketValueChart to avoid SSR issues
const MarketValueChart = dynamic(
  () => import("@/components/dashboard/MarketValueChart"),
  { ssr: false }
);

interface PrintLayoutProps {
  data: {
    jobs: Array<{
      job_id: string;
      title: string;
      employer_name: string;
      location: string;
      salary_min?: number;
      salary_max?: number;
      extracted_salary?: number;
      match_score: number;
      fit_reason?: string;
      apply_link?: string;
    }>;
    userName: string;
    skills?: string[];
  };
}

const PrintLayout = forwardRef<HTMLDivElement, PrintLayoutProps>(({ data }, ref) => {
  const topJobs = data.jobs.slice(0, 3);
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div ref={ref} className="bg-white p-8 text-black print:p-8">
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.75in;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="icon" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Confidential Career Intelligence Report
              </h1>
              <p className="text-sm text-gray-600">Generated {currentDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-8">
        {/* Section 1: Market Value Chart */}
        <section className="print-break print-avoid-break">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Market Value Analysis
          </h2>
          <div className="print-chart-container" style={{ width: "100%", height: "400px" }}>
            <MarketValueChart jobs={data.jobs} />
          </div>
        </section>

        {/* Section 2: Top 3 Strategic Matches */}
        <section className="print-break print-avoid-break">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Top 3 Strategic Matches
          </h2>
          {topJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {topJobs.map((job, index) => (
                <div
                  key={job.job_id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm print-avoid-break"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {job.employer_name}
                      </p>
                    </div>
                    <div className="rounded-full border-2 border-green-600 px-2.5 py-0.5 text-xs font-bold text-green-600">
                      {job.match_score}%
                    </div>
                  </div>

                  <div className="mb-4 space-y-2 text-sm">
                    <p className="text-gray-600">
                      <strong>Location:</strong> {job.location}
                    </p>
                    {job.salary_min && job.salary_max && (
                      <p className="text-gray-600">
                        <strong>Salary:</strong> ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                      </p>
                    )}
                    {job.extracted_salary && (
                      <p className="text-gray-600">
                        <strong>Salary:</strong> ${(job.extracted_salary / 1000).toFixed(0)}k
                      </p>
                    )}
                  </div>

                  {job.fit_reason && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs font-medium text-gray-900 mb-1">
                        Why You&apos;re a Match:
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {job.fit_reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
              <p className="text-gray-600">
                No job recommendations available. Complete your profile to see matches.
              </p>
            </div>
          )}
        </section>

        {/* Section 3: Skill Gap Analysis */}
        <section className="print-avoid-break">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Skill Gap Analysis
          </h2>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {data.skills && data.skills.length > 0 ? (
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Your Current Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  These skills are being matched against current job market requirements.
                  Consider adding skills that appear frequently in your target roles.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  No skills listed in your resume.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
          <p>
            Generated by Resonate AI | resonate.app
          </p>
          <p className="mt-1">
            Confidential Report for {data.userName} • {currentDate}
          </p>
        </div>
      </div>
    </div>
  );
});

PrintLayout.displayName = "PrintLayout";

export default PrintLayout;

