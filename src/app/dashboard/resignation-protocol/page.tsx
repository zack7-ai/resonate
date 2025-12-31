"use client";

import { useState } from "react";
import { FileText, Clock, Mail, Users, AlertTriangle, CheckCircle2, Loader2, Copy } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Timeline {
  dayMinus30: string;
  dayMinus14: string;
  dayMinus7: string;
  day0: string;
  dayPlus1: string;
  dayPlus7: string;
  dayPlus14: string;
  dayPlus30: string;
}

interface ResignationLetter {
  subject: string;
  body: string;
  tone: string;
}

interface ConversationScript {
  managerMeeting: string;
  keyPoints: string[];
  whatToSay: string;
  whatNotToSay: string[];
}

interface TransitionPlan {
  knowledgeTransfer: string[];
  documentation: string[];
  handoffTasks: string[];
}

interface RelationshipPreservation {
  colleagues: string;
  manager: string;
  clients: string;
  linkedinRecommendations: string;
}

interface Protocol {
  summary: string;
  timeline: Timeline;
  resignationLetter: ResignationLetter;
  conversationScript: ConversationScript;
  transitionPlan: TransitionPlan;
  relationshipPreservation: RelationshipPreservation;
  legalConsiderations: string[];
  checklist: string[];
}

export default function ResignationProtocolPage() {
  const [currentRole, setCurrentRole] = useState("");
  const [company, setCompany] = useState("");
  const [reason, setReason] = useState("");
  const [noticePeriodDays, setNoticePeriodDays] = useState("14");
  const [relationshipWithManager, setRelationshipWithManager] = useState("professional");
  const [exitStrategy, setExitStrategy] = useState("standard");
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const { isPremium } = useSubscription();

  const handleGenerate = async () => {
    if (!currentRole.trim() || !company.trim()) {
      setError("Please enter your current role and company");
      return;
    }

    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/resignation-protocol", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentRole,
          company,
          reason,
          noticePeriodDays: parseInt(noticePeriodDays) || 14,
          relationshipWithManager,
          exitStrategy,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate protocol");
      }

      const result = await response.json();
      setProtocol(result.protocol);
    } catch (err) {
      console.error("Error generating protocol:", err);
      setError(err instanceof Error ? err.message : "Failed to generate protocol");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Resignation Protocol</h1>
        <p className="mt-2 text-gray-400">
          Create a strategic plan for leaving your role professionally
        </p>
      </div>

      {!protocol ? (
        <div className="max-w-3xl">
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-white">Resignation Details</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Current Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                  placeholder="e.g., Senior Product Manager"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Company <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                  placeholder="e.g., Acme Corp"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Notice Period (days)
                  </label>
                  <input
                    type="number"
                    value={noticePeriodDays}
                    onChange={(e) => setNoticePeriodDays(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                    placeholder="14"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Relationship with Manager
                  </label>
                  <select
                    value={relationshipWithManager}
                    onChange={(e) => setRelationshipWithManager(e.target.value)}
                    className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-2 text-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors"
                  >
                    <option value="professional">Professional</option>
                    <option value="positive">Positive/Friendly</option>
                    <option value="neutral">Neutral</option>
                    <option value="challenging">Challenging</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Reason for Leaving
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-800 bg-slate-800 px-4 py-3 text-white placeholder-gray-500 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="e.g., Career advancement opportunity, better alignment with long-term goals..."
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !currentRole.trim() || !company.trim()}
                className="w-full rounded-lg bg-brand-blue px-6 py-3 text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Protocol...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Generate Resignation Protocol
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h2 className="mb-3 text-xl font-semibold text-white">Protocol Summary</h2>
            <p className="text-gray-300">{protocol.summary}</p>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand-blue" />
              <h3 className="text-lg font-semibold text-white">Timeline</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(protocol.timeline).map(([key, value]) => (
                <div key={key} className="border-l-2 border-brand-blue/30 pl-4">
                  <p className="mb-1 text-sm font-semibold text-gray-400">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                  <p className="text-gray-300">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Resignation Letter */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-blue" />
                <h3 className="text-lg font-semibold text-white">Resignation Letter</h3>
              </div>
              <button
                onClick={() => copyToClipboard(protocol.resignationLetter.body, "letter")}
                className="flex items-center gap-2 rounded-lg border border-gray-800 bg-slate-800 px-3 py-1.5 text-sm text-gray-300 transition-colors hover:bg-slate-700"
              >
                <Copy className="h-4 w-4" />
                {copiedText === "letter" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-400">Subject:</p>
                <p className="text-gray-300">{protocol.resignationLetter.subject}</p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">Body:</p>
                <div className="rounded-lg bg-slate-800/50 p-4">
                  <p className="whitespace-pre-line text-gray-300">
                    {protocol.resignationLetter.body}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation Script */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h3 className="mb-4 flex items-center gap-3 text-lg font-semibold text-white">
              <Users className="h-5 w-5 text-brand-blue" />
              Conversation Script
            </h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">What to Say:</p>
                <div className="rounded-lg bg-brand-green/5 border border-brand-green/20 p-4">
                  <p className="text-gray-300">{protocol.conversationScript.whatToSay}</p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">Key Points:</p>
                <ul className="space-y-2">
                  {protocol.conversationScript.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-brand-green" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">What NOT to Say:</p>
                <ul className="space-y-2">
                  {protocol.conversationScript.whatNotToSay.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-yellow-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Transition Plan */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Transition Plan</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">Knowledge Transfer:</p>
                <ul className="space-y-1">
                  {protocol.transitionPlan.knowledgeTransfer.map((item, idx) => (
                    <li key={idx} className="text-gray-300">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">Documentation:</p>
                <ul className="space-y-1">
                  {protocol.transitionPlan.documentation.map((item, idx) => (
                    <li key={idx} className="text-gray-300">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-gray-400">Handoff Tasks:</p>
                <ul className="space-y-1">
                  {protocol.transitionPlan.handoffTasks.map((item, idx) => (
                    <li key={idx} className="text-gray-300">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Relationship Preservation */}
          <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Relationship Preservation</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-400">Colleagues:</p>
                <p className="text-gray-300">{protocol.relationshipPreservation.colleagues}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-400">Manager:</p>
                <p className="text-gray-300">{protocol.relationshipPreservation.manager}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-400">LinkedIn Recommendations:</p>
                <p className="text-gray-300">{protocol.relationshipPreservation.linkedinRecommendations}</p>
              </div>
            </div>
          </div>

          {/* Legal Considerations */}
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Legal Considerations
            </h3>
            <ul className="space-y-2">
              {protocol.legalConsiderations.map((consideration, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <AlertTriangle className="mt-1 h-4 w-4 flex-shrink-0 text-yellow-400" />
                  <span>{consideration}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Checklist */}
          <div className="rounded-lg border border-gray-800 bg-slate-900 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-white">Checklist</h3>
            <ul className="space-y-2">
              {protocol.checklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-300">
                  <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-brand-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => setProtocol(null)}
              className="rounded-lg border border-gray-800 bg-slate-800 px-6 py-2 text-white transition-colors hover:bg-slate-700"
            >
              Create New Protocol
            </button>
          </div>
        </div>
      )}

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Resignation Protocol"
      />
    </div>
  );
}


