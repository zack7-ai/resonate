"use client";

import { useState } from "react";
import { X, Copy, Check, Mail, Linkedin, Loader2, Network } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { resumeDataToText } from "@/utils/resumeToText";

interface NetworkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
}

type RecipientType = "Recruiter" | "Hiring Manager" | "Peer";

export default function NetworkingModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  company,
  jobDescription,
}: NetworkingModalProps) {
  const [recipientType, setRecipientType] = useState<RecipientType>("Hiring Manager");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<{
    emailSubject: string;
    emailBody: string;
    linkedinNote: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: resumeData } = useResumeStore();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!jobDescription) {
      alert("Job description is required. Please add it to this job first.");
      return;
    }

    if (!resumeData.name || !resumeData.summary) {
      alert("Please complete your resume summary before generating networking messages.");
      return;
    }

    setIsGenerating(true);
    setMessages(null);

    try {
      // Convert resume data to summary text
      const resumeText = resumeDataToText(resumeData);
      const resumeSummary = resumeData.summary || resumeText.substring(0, 500);

      const response = await fetch('/api/ai/network/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resumeSummary,
          recipientType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate messages');
      }

      const result = await response.json();
      setMessages(result);
    } catch (error) {
      console.error('Error generating networking messages:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate networking messages');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-brand-blue/50 bg-slate-900 p-6 shadow-2xl shadow-glow-blue-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-brand-blue/20 p-2">
              <Network className="h-6 w-6 text-brand-blue" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Networking Outreach</h2>
              <p className="text-sm text-gray-400">
                Generate personalized messages for {company} - {jobTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 rounded-lg border border-gray-800 bg-slate-800/50 p-4">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Who are you messaging?
          </label>
          <select
            value={recipientType}
            onChange={(e) => setRecipientType(e.target.value as RecipientType)}
            className="w-full rounded-lg border border-gray-700 bg-slate-800 px-4 py-2 text-white focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            disabled={isGenerating}
          >
            <option value="Recruiter">Recruiter</option>
            <option value="Hiring Manager">Hiring Manager</option>
            <option value="Peer">Peer / Industry Contact</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !jobDescription}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-green px-6 py-3 font-semibold text-white transition-all hover:from-brand-green hover:to-brand-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating drafts...
              </span>
            ) : (
              "Generate Drafts"
            )}
          </button>
          {!jobDescription && (
            <p className="mt-2 text-sm text-yellow-400">
              ⚠️ Job description required. Please add it to this job first.
            </p>
          )}
        </div>

        {/* Generated Messages */}
        {messages && (
          <div className="space-y-6">
            {/* Email Subject */}
            <div className="rounded-lg border border-gray-800 bg-slate-800/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-blue" />
                  <h3 className="text-lg font-semibold text-white">Email Subject</h3>
                </div>
                <button
                  onClick={() => handleCopy(messages.emailSubject, 'subject')}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-slate-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                >
                  {copiedField === 'subject' ? (
                    <>
                      <Check className="h-4 w-4 text-brand-green" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-gray-700 bg-slate-900 p-3">
                <p className="text-white">{messages.emailSubject}</p>
              </div>
            </div>

            {/* Email Body */}
            <div className="rounded-lg border border-gray-800 bg-slate-800/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-brand-blue" />
                  <h3 className="text-lg font-semibold text-white">Email Body</h3>
                </div>
                <button
                  onClick={() => handleCopy(messages.emailBody, 'body')}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-slate-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                >
                  {copiedField === 'body' ? (
                    <>
                      <Check className="h-4 w-4 text-brand-green" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-gray-700 bg-slate-900 p-4">
                <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {messages.emailBody}
                </p>
              </div>
            </div>

            {/* LinkedIn Note */}
            <div className="rounded-lg border border-gray-800 bg-slate-800/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-5 w-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">LinkedIn Connection Note</h3>
                </div>
                <button
                  onClick={() => handleCopy(messages.linkedinNote, 'linkedin')}
                  className="flex items-center gap-2 rounded-lg border border-gray-700 bg-slate-700 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-slate-600 hover:text-white"
                >
                  {copiedField === 'linkedin' ? (
                    <>
                      <Check className="h-4 w-4 text-brand-green" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-gray-700 bg-slate-900 p-3">
                <p className="text-gray-300">{messages.linkedinNote}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {messages.linkedinNote.length} / 300 characters
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 bg-slate-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


