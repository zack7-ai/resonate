import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_apply_link?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_description?: string;
  job_employment_type?: string;
  employer_logo?: string;
}

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
  extracted_salary?: number; // Extracted salary from AI analysis
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's profile and resume data
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("user_id", userId)
      .single();

    // Get user's resume to extract skills and job title preference
    const { data: resumes } = await supabaseAdmin
      .from("resumes")
      .select("content")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    const resumeData = resumes && resumes.length > 0 ? resumes[0].content : null;
    const skills = resumeData?.skills || [];
    const jobTitle = resumeData?.summary || resumeData?.experience?.[0]?.title || "Software Engineer";
    const location = resumeData?.location || "Remote";

    // If no skills, return empty array with a flag
    if (!skills || skills.length === 0) {
      return NextResponse.json({
        jobs: [],
        needsProfile: true,
        message: "Complete your profile with skills to activate Radar recommendations",
      });
    }

    // Check if RapidAPI key is configured
    if (!process.env.RAPID_API_KEY) {
      console.warn("RAPID_API_KEY not configured. Returning mock data.");
      return NextResponse.json({
        jobs: generateMockJobs(skills, jobTitle),
        needsProfile: false,
      });
    }

    // Construct search query
    const searchQuery = `${jobTitle} ${location}`;
    const numPages = 1;
    const page = 1;

    try {
      // Call JSearch API
      const apiResponse = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=${numPages}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      if (!apiResponse.ok) {
        console.error("JSearch API error:", apiResponse.status, apiResponse.statusText);
        // Fallback to mock data if API fails
        return NextResponse.json({
          jobs: generateMockJobs(skills, jobTitle),
          needsProfile: false,
        });
      }

      const apiData = await apiResponse.json();
      const jobs: JSearchJob[] = apiData.data || [];

      // Transform and calculate match scores
      const recommendedJobs: RecommendedJob[] = jobs.slice(0, 10).map((job) => {
        const matchScore = calculateMatchScore(job, skills, jobTitle);
        
        return {
          job_id: job.job_id,
          title: job.job_title,
          employer_name: job.employer_name,
          location: formatLocation(job),
          salary_min: job.job_min_salary,
          salary_max: job.job_max_salary,
          apply_link: job.job_apply_link,
          match_score: matchScore,
          description: job.job_description,
          employment_type: job.job_employment_type,
          logo: job.employer_logo,
        };
      });

      // Sort by match score (highest first)
      recommendedJobs.sort((a, b) => b.match_score - a.match_score);

      return NextResponse.json({
        jobs: recommendedJobs,
        needsProfile: false,
      });
    } catch (error) {
      console.error("Error fetching jobs from JSearch:", error);
      // Fallback to mock data
      return NextResponse.json({
        jobs: generateMockJobs(skills, jobTitle),
        needsProfile: false,
      });
    }
  } catch (error) {
    console.error("Error in recommend route:", error);
    return NextResponse.json(
      { error: "Failed to fetch job recommendations" },
      { status: 500 }
    );
  }
}

function calculateMatchScore(job: JSearchJob, skills: string[], jobTitle: string): number {
  let score = 50; // Base score

  const jobText = `${job.job_title} ${job.job_description || ""}`.toLowerCase();
  const titleLower = jobTitle.toLowerCase();

  // Title match (30 points)
  if (job.job_title.toLowerCase().includes(titleLower) || titleLower.includes(job.job_title.toLowerCase())) {
    score += 30;
  }

  // Skills match (20 points)
  const matchedSkills = skills.filter((skill) =>
    jobText.includes(skill.toLowerCase())
  ).length;
  score += Math.min(matchedSkills * 5, 20);

  // Employment type bonus (if remote)
  if (job.job_employment_type?.toLowerCase().includes("remote")) {
    score += 10;
  }

  // Salary bonus (if listed)
  if (job.job_min_salary || job.job_max_salary) {
    score += 10;
  }

  return Math.min(score, 100);
}

function formatLocation(job: JSearchJob): string {
  const parts = [];
  if (job.job_city) parts.push(job.job_city);
  if (job.job_state) parts.push(job.job_state);
  if (job.job_country && job.job_country !== "US") parts.push(job.job_country);
  
  if (parts.length === 0) return "Remote";
  return parts.join(", ");
}

function generateMockJobs(skills: string[], jobTitle: string): RecommendedJob[] {
  const companies = [
    "Google", "Microsoft", "Amazon", "Netflix", "Meta", "Apple", "Tesla", "Uber", "Airbnb", "Stripe"
  ];
  
  const locations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Remote"
  ];

  return companies.slice(0, 6).map((company, index) => ({
    job_id: `mock-${index}`,
    title: jobTitle,
    employer_name: company,
    location: locations[index % locations.length],
    salary_min: 120000 + (index * 10000),
    salary_max: 180000 + (index * 15000),
    apply_link: `https://${company.toLowerCase()}.com/careers`,
    match_score: 75 + (index * 3),
    description: `Join ${company} as a ${jobTitle}. Required skills: ${skills.slice(0, 3).join(", ")}.`,
    employment_type: index % 2 === 0 ? "FULLTIME" : "REMOTE",
    logo: undefined,
  }));
}

