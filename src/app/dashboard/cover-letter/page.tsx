"use client";

import { useState, useEffect } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { useUser } from "@clerk/nextjs";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";

interface Job {
  id: string;
  company: string;
  title: string;
  job_description_text?: string;
}

export default function CoverLetterPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [coverLetterContent, setCoverLetterContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: resumeData } = useResumeStore();
  const { user } = useUser();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs/list');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      const result = await response.json();
      setJobs(result.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handleGenerate = async () => {
    if (!selectedJob) {
      setError('Please select a job');
      return;
    }

    if (!resumeData.name || !resumeData.email) {
      setError('Please complete your resume first (name and email required)');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          jobDescription: selectedJob.job_description_text || '',
          jobTitle: selectedJob.title,
          companyName: selectedJob.company,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate cover letter');
      }

      const result = await response.json();
      setCoverLetterContent(result.content);
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Cover Letter Generator</h1>
        <p className="mt-2 text-gray-400">
          Generate a custom cover letter tailored to each job application
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Panel - Job Selection & Generate */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-white">Select Job</h2>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Choose a job to target
              </label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
              >
                <option value="">-- Select a job --</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} @ {job.company}
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="mb-4 rounded-lg border border-brand-blue/30 bg-brand-blue/5 p-4">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">{selectedJob.title}</span>
                  <span className="text-gray-400"> at </span>
                  <span className="font-semibold text-white">{selectedJob.company}</span>
                </p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!selectedJob || isGenerating}
              className="w-full rounded-lg bg-brand-blue px-4 py-3 text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Generate Letter
                </span>
              )}
            </button>

            {error && (
              <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Editor & Download */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Cover Letter</h2>
              {coverLetterContent && (
                <PDFDownloadLink
                  document={
                    <CoverLetterDocument
                      senderName={resumeData.name || 'Your Name'}
                      senderEmail={resumeData.email || ''}
                      senderPhone={resumeData.phone || ''}
                      companyName={selectedJob?.company || ''}
                      content={coverLetterContent}
                    />
                  }
                  fileName={`Cover_Letter_${selectedJob?.company?.replace(/\s+/g, '_') || 'Job'}.pdf`}
                  className="flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                >
                  {({ loading }) => (
                    <>
                      <Download className="h-4 w-4" />
                      {loading ? 'Preparing...' : 'Download PDF'}
                    </>
                  )}
                </PDFDownloadLink>
              )}
            </div>

            {coverLetterContent ? (
              <textarea
                value={coverLetterContent}
                onChange={(e) => setCoverLetterContent(e.target.value)}
                className="h-96 w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-3 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors resize-none"
                placeholder="Generated cover letter will appear here..."
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-gray-800 bg-slate-900/50">
                <p className="text-gray-500">
                  Select a job and click &quot;Generate Letter&quot; to create your cover letter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

