"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2, MessageSquare, Code, Play, Send, Award } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/ui/UpgradeModal";

interface Job {
  id: string;
  company: string;
  title: string;
  job_description_text?: string;
}

interface Question {
  question: string;
  tip: string;
  category: string;
}

interface InterviewPrepResult {
  questions: Question[];
}

interface InterviewFeedback {
  grade: string;
  feedback: string;
  improvements: string[];
  starMethodCheck: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
}

interface QuestionWithAnswer extends Question {
  userAnswer?: string;
  feedback?: InterviewFeedback;
  isActive?: boolean;
}

export default function InterviewPrepPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [prepResult, setPrepResult] = useState<InterviewPrepResult | null>(null);
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { isPremium } = useSubscription();

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

  const handleRunSimulation = async () => {
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedJob) {
      setError('Please select a job');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setPrepResult(null);
    setQuestionsWithAnswers([]);
    setCurrentQuestionIndex(null);
    setUserAnswers({});

    try {
      const response = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: selectedJob.job_description_text || '',
          jobTitle: selectedJob.title,
          companyName: selectedJob.company,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate interview prep');
      }

      const result = await response.json();
      setPrepResult(result);
      // Initialize questions with answers state
      setQuestionsWithAnswers(result.questions.map((q: Question) => ({ ...q, isActive: false })));
      setCurrentQuestionIndex(0); // Start with first question
      setUserAnswers({});
    } catch (err) {
      console.error('Error generating interview prep:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate interview prep');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSubmit = async (questionIndex: number) => {
    const answer = userAnswers[questionIndex];
    if (!answer || answer.trim().length === 0) {
      alert('Please provide an answer before submitting');
      return;
    }

    setIsGettingFeedback({ ...isGettingFeedback, [questionIndex]: true });

    try {
      const question = questionsWithAnswers[questionIndex];
      const response = await fetch('/api/ai/interview-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.question,
          userAnswer: answer,
          jobDescription: selectedJob?.job_description_text || '',
          questionCategory: question.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }

      const feedback = await response.json();
      
      // Update the question with feedback
      const updatedQuestions = [...questionsWithAnswers];
      updatedQuestions[questionIndex] = {
        ...question,
        userAnswer: answer,
        feedback,
      };
      setQuestionsWithAnswers(updatedQuestions);

      // Move to next question if available
      if (questionIndex < questionsWithAnswers.length - 1) {
        setCurrentQuestionIndex(questionIndex + 1);
      }
    } catch (err) {
      console.error('Error getting feedback:', err);
      alert('Failed to get feedback. Please try again.');
    } finally {
      setIsGettingFeedback({ ...isGettingFeedback, [questionIndex]: false });
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade.toUpperCase()) {
      case 'A': return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'B': return 'text-blue-400 bg-blue-400/20 border-blue-400/50';
      case 'C': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'D': return 'text-orange-400 bg-orange-400/20 border-orange-400/50';
      case 'F': return 'text-red-400 bg-red-400/20 border-red-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  return (
    <>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="Interview Prep Simulator"
      />
      <div className="px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Interview Prep</h1>
          <p className="mt-2 text-gray-400">
            Prepare for your interview with AI-generated questions tailored to each role
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Role Context */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-800 bg-slate-900/50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Role Context</h2>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Choose a job to prepare for
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setPrepResult(null);
                setQuestionsWithAnswers([]);
                setCurrentQuestionIndex(null);
                setUserAnswers({});
              }}
              className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-2 text-white focus:border-brand-blue focus:outline-none"
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
            onClick={handleRunSimulation}
            disabled={!selectedJob || isGenerating}
            className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-3 text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting Simulation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Start Simulation
                </>
              )}
          </button>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {selectedJob && (
            <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/5 p-6">
              <h3 className="mb-3 font-semibold text-white">Job Description</h3>
              <div className="max-h-64 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap">
                {selectedJob.job_description_text || 'No description available'}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Right Column - Simulation Console */}
        <div className="space-y-6">
          {questionsWithAnswers.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Simulation Console
              </h2>
              
              {questionsWithAnswers.map((q, index) => (
                <div
                  key={index}
                  className={`rounded-lg border ${
                    currentQuestionIndex === index
                      ? 'border-brand-blue bg-slate-900/80'
                      : 'border-gray-800 bg-slate-900/50'
                  } overflow-hidden`}
                >
                  {/* Question */}
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {q.category === 'behavioral' ? (
                          <MessageSquare className="h-5 w-5 text-brand-blue" />
                        ) : (
                          <Code className="h-5 w-5 text-brand-green" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-white">Question {index + 1}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            q.category === 'behavioral' 
                              ? 'bg-brand-blue/20 text-brand-blue' 
                              : 'bg-brand-green/20 text-brand-green'
                          }`}>
                            {q.category}
                          </span>
                          {currentQuestionIndex === index && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300">{q.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Input */}
                  {currentQuestionIndex === index && (
                    <div className="p-4 bg-slate-800/30">
                      <textarea
                        value={userAnswers[index] || ''}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [index]: e.target.value })}
                        placeholder="Type your answer here... (Use the STAR method: Situation, Task, Action, Result)"
                        className="w-full rounded-lg border border-gray-700 bg-slate-900 px-4 py-3 text-white focus:border-brand-blue focus:outline-none mb-3 min-h-32"
                      />
                      <button
                        onClick={() => handleAnswerSubmit(index)}
                        disabled={isGettingFeedback[index] || !userAnswers[index]?.trim()}
                        className="flex items-center gap-2 rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGettingFeedback[index] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Getting Feedback...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Submit Answer
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Feedback Display */}
                  {q.feedback && (
                    <div className="border-t border-gray-800 bg-slate-800/30 p-4">
                      <div className={`rounded-lg border p-4 mb-3 ${getGradeColor(q.feedback.grade)}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5" />
                          <span className="font-semibold">Grade: {q.feedback.grade}</span>
                        </div>
                        <p className="text-sm mb-3">{q.feedback.feedback}</p>
                        <div>
                          <h5 className="text-xs font-semibold mb-2 uppercase">Improvements:</h5>
                          <ul className="list-disc list-inside text-xs space-y-1">
                            {q.feedback.improvements.map((improvement, idx) => (
                              <li key={idx}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-3 pt-3 border-t border-current/20">
                          <h5 className="text-xs font-semibold mb-2 uppercase">STAR Method Check:</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={q.feedback.starMethodCheck.situation ? 'text-green-400' : 'text-gray-500'}>
                              {q.feedback.starMethodCheck.situation ? '✓' : '✗'} Situation
                            </div>
                            <div className={q.feedback.starMethodCheck.task ? 'text-green-400' : 'text-gray-500'}>
                              {q.feedback.starMethodCheck.task ? '✓' : '✗'} Task
                            </div>
                            <div className={q.feedback.starMethodCheck.action ? 'text-green-400' : 'text-gray-500'}>
                              {q.feedback.starMethodCheck.action ? '✓' : '✗'} Action
                            </div>
                            <div className={q.feedback.starMethodCheck.result ? 'text-green-400' : 'text-gray-500'}>
                              {q.feedback.starMethodCheck.result ? '✓' : '✗'} Result
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Original Tip */}
                      <div className="rounded-lg border border-brand-green/30 bg-brand-green/5 p-3">
                        <h4 className="mb-1 text-xs font-semibold text-brand-green">Original AI Tip</h4>
                        <p className="text-xs text-gray-300">{q.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {questionsWithAnswers.length === 0 && !isGenerating && selectedJob && (
            <div className="rounded-lg border border-dashed border-gray-700 bg-slate-900/50 p-12 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-600" />
              <p className="text-gray-400">
                Click &quot;Start Simulation&quot; to begin your interview preparation
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

