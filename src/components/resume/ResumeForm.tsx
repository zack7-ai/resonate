"use client";

import { useResumeStore } from "@/stores/useResumeStore";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/ui/EmptyState";

interface ResumeFormProps {
  jobDescription?: string;
  jobTitle?: string;
}

export default function ResumeForm({ jobDescription, jobTitle }: ResumeFormProps) {
  const { data, updateData, addExperience, updateExperience, removeExperience, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [enhancingIndex, setEnhancingIndex] = useState<string | null>(null); // Format: "exp-{id}-{descIndex}"

  const handleAddExperience = () => {
    addExperience({
      id: Date.now().toString(),
      company: "",
      location: "",
      title: "",
      startDate: "",
      endDate: "",
      description: [""],
    });
  };

  const handleAddEducation = () => {
    addEducation({
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleAddDescription = (expId: string, currentDescriptions: string[]) => {
    updateExperience(expId, {
      description: [...currentDescriptions, ""],
    });
  };

  const handleRemoveDescription = (expId: string, index: number, currentDescriptions: string[]) => {
    updateExperience(expId, {
      description: currentDescriptions.filter((_, i) => i !== index),
    });
  };

  const handleEnhanceBullet = async (expId: string, descIndex: number, currentBullet: string) => {
    const enhanceKey = `exp-${expId}-${descIndex}`;
    setEnhancingIndex(enhanceKey);

    try {
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentBullet,
          jobDescription,
          tone: 'Assertive',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance bullet point');
      }

      const result = await response.json();
      const { rewrittenText } = result;

      // Update the specific bullet point
      const exp = data.experience.find((e) => e.id === expId);
      if (exp) {
        const newDescriptions = [...exp.description];
        newDescriptions[descIndex] = rewrittenText;
        updateExperience(expId, { description: newDescriptions });
      }

      // Show success notification
      const notification = jobTitle
        ? `Optimized for ${jobTitle}`
        : 'Bullet point enhanced';
      // Simple alert for now - can be replaced with toast library later
      alert(notification);
    } catch (error) {
      console.error('Error enhancing bullet:', error);
      alert('Failed to enhance bullet point. Please try again.');
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6 overflow-y-auto p-6">
      {/* Personal Information */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Personal Information</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => updateData({ email: e.target.value })}
              className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={data.phone || ""}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={data.location || ""}
                onChange={(e) => updateData({ location: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
                placeholder="City, State"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={data.linkedin || ""}
                onChange={(e) => updateData({ linkedin: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={data.website || ""}
                onChange={(e) => updateData({ website: e.target.value })}
                className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
                placeholder="johndoe.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
        <textarea
          value={data.summary || ""}
          onChange={(e) => updateData({ summary: e.target.value })}
          className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
          rows={4}
          placeholder="Brief professional summary..."
        />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Experience</h2>
          <button
            onClick={handleAddExperience}
            className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>
        <div className="space-y-4">
          {data.experience.length === 0 ? (
            <EmptyState
              icon="resume"
              title="No experience entries"
              description="Add your work experience to build a comprehensive resume."
              actionLabel="Add Experience"
              onAction={handleAddExperience}
            />
          ) : (
            data.experience.map((exp) => (
              <div
                key={exp.id}
                className="rounded-lg border border-gray-700 bg-slate-900/50 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-white">Experience #{data.experience.indexOf(exp) + 1}</h3>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Company *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, { location: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(exp.id, { title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { startDate: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { endDate: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="MM/YYYY or Present"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">
                      Description
                    </label>
                    <button
                      onClick={() =>
                        handleAddDescription(exp.id, exp.description)
                      }
                      className="text-xs text-brand-blue hover:text-brand-green"
                    >
                      + Add Bullet
                    </button>
                  </div>
                  {exp.description.map((desc, idx) => {
                    const enhanceKey = `exp-${exp.id}-${idx}`;
                    const isEnhancing = enhancingIndex === enhanceKey;
                    const hasJobContext = !!jobDescription;
                    
                    return (
                      <div key={idx} className="mb-2 flex gap-2">
                        <input
                          type="text"
                          value={desc}
                          onChange={(e) => {
                            const newDesc = [...exp.description];
                            newDesc[idx] = e.target.value;
                            updateExperience(exp.id, { description: newDesc });
                          }}
                          className="flex-1 rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                          placeholder="Achievement or responsibility..."
                          disabled={isEnhancing}
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEnhanceBullet(exp.id, idx, desc)}
                            disabled={isEnhancing || !desc.trim()}
                            className="flex items-center gap-1 rounded-lg border border-purple-600 bg-purple-600/10 px-3 py-2 text-xs font-medium text-purple-400 transition-colors hover:bg-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={hasJobContext ? "Enhance with AI (Optimizing for Selected Role)" : "Enhance with AI"}
                          >
                            {isEnhancing ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                <span>Enhancing...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                <span>Enhance</span>
                              </>
                            )}
                          </button>
                          {hasJobContext && (
                            <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs font-medium text-brand-green">
                              Optimizing for Role
                            </span>
                          )}
                        </div>
                        {exp.description.length > 1 && (
                          <button
                            onClick={() =>
                              handleRemoveDescription(exp.id, idx, exp.description)
                            }
                            className="text-red-400 hover:text-red-300 disabled:opacity-50"
                            disabled={isEnhancing}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Education</h2>
          <button
            onClick={handleAddEducation}
            className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-gray-700 bg-slate-900/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-white">Education #{data.education.indexOf(edu) + 1}</h3>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      School *
                    </label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, { school: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) =>
                        updateEducation(edu.id, { location: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Degree
                    </label>
                    <input
                      type="text"
                      value={edu.degree || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="B.S., M.S., etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field || ""}
                      onChange={(e) =>
                        updateEducation(edu.id, { field: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { startDate: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { endDate: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-700 bg-slate-900 px-3 py-2 text-white focus:border-brand-blue focus:outline-none"
                      placeholder="YYYY or Present"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Skills</h2>
        <input
          type="text"
          value={data.skills?.join(", ") || ""}
          onChange={(e) =>
            updateData({
              skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
          placeholder="React, TypeScript, Node.js (comma-separated)"
        />
      </section>
    </div>
  );
}

