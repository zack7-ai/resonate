import { ResumeData } from "@/stores/useResumeStore";

export interface FTQError {
  type: "placeholder" | "missing_contact" | "generic_placeholder" | "empty_field";
  message: string;
  field?: string;
}

export interface FTQResult {
  score: number;
  errors: FTQError[];
  passed: boolean;
}

/**
 * First Time Quality Checker
 * Scans resume for common errors: placeholders, missing info, generic text
 * Optionally checks for keyword matching with job description
 */
export function checkFTQ(data: ResumeData, jobDescription?: string): FTQResult {
  const errors: FTQError[] = [];

  // Check for placeholder patterns: [placeholder], {placeholder}, [Your Name], etc.
  const placeholderPatterns = [
    /\[.*?\]/g,
    /\{.*?\}/g,
    /\[Your.*?\]/gi,
    /\{Your.*?\}/gi,
    /\[Enter.*?\]/gi,
    /\{Enter.*?\}/gi,
  ];

  // Function to check text for placeholders
  const checkForPlaceholders = (text: string, fieldName: string) => {
    placeholderPatterns.forEach((pattern) => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          errors.push({
            type: "placeholder",
            message: `Placeholder found in ${fieldName}: ${match}`,
            field: fieldName,
          });
        });
      }
    });
  };

  // Check for "To Whom It May Concern" or generic greetings
  const genericTextPatterns = [
    /to whom it may concern/gi,
    /dear sir\/madam/gi,
    /dear hiring manager/gi,
    /dear recruiter/gi,
    /\[company name\]/gi,
    /\{company name\}/gi,
  ];

  const checkForGenericText = (text: string, fieldName: string) => {
    genericTextPatterns.forEach((pattern) => {
      if (pattern.test(text)) {
        errors.push({
          type: "generic_placeholder",
          message: `Generic placeholder text found in ${fieldName}`,
          field: fieldName,
        });
      }
    });
  };

  // Check required fields
  if (!data.name || data.name.trim().length === 0) {
    errors.push({
      type: "empty_field",
      message: "Name is required",
      field: "name",
    });
  } else {
    checkForPlaceholders(data.name, "name");
    checkForGenericText(data.name, "name");
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push({
      type: "missing_contact",
      message: "Email is required",
      field: "email",
    });
  } else {
    checkForPlaceholders(data.email, "email");
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push({
        type: "missing_contact",
        message: "Invalid email format",
        field: "email",
      });
    }
  }

  // Check summary
  if (data.summary) {
    checkForPlaceholders(data.summary, "summary");
    checkForGenericText(data.summary, "summary");
  }

  // Check experience
  data.experience.forEach((exp, index) => {
    if (!exp.company || exp.company.trim().length === 0) {
      errors.push({
        type: "empty_field",
        message: `Company name is required for experience #${index + 1}`,
        field: `experience.${index}.company`,
      });
    } else {
      checkForPlaceholders(exp.company, `experience.${index}.company`);
    }

    if (!exp.location || exp.location.trim().length === 0) {
      errors.push({
        type: "empty_field",
        message: `Location is required for experience #${index + 1}`,
        field: `experience.${index}.location`,
      });
    } else {
      checkForPlaceholders(exp.location, `experience.${index}.location`);
    }

    if (!exp.title || exp.title.trim().length === 0) {
      errors.push({
        type: "empty_field",
        message: `Job title is required for experience #${index + 1}`,
        field: `experience.${index}.title`,
      });
    } else {
      checkForPlaceholders(exp.title, `experience.${index}.title`);
    }

    exp.description.forEach((desc, descIndex) => {
      if (desc.trim().length > 0) {
        checkForPlaceholders(desc, `experience.${index}.description.${descIndex}`);
        checkForGenericText(desc, `experience.${index}.description.${descIndex}`);
      }
    });
  });

  // Check education
  data.education.forEach((edu, index) => {
    if (!edu.school || edu.school.trim().length === 0) {
      errors.push({
        type: "empty_field",
        message: `School name is required for education #${index + 1}`,
        field: `education.${index}.school`,
      });
    } else {
      checkForPlaceholders(edu.school, `education.${index}.school`);
    }

    if (!edu.location || edu.location.trim().length === 0) {
      errors.push({
        type: "empty_field",
        message: `Location is required for education #${index + 1}`,
        field: `education.${index}.location`,
      });
    } else {
      checkForPlaceholders(edu.location, `education.${index}.location`);
    }
  });

  // Check for keyword matching if job description is provided
  if (jobDescription) {
    // Extract keywords from job description (simple approach: common tech/role keywords)
    const jobDescriptionLower = jobDescription.toLowerCase();
    
    // Common keywords to look for (this is a simplified version)
    // In production, you'd want more sophisticated keyword extraction
    const keywordPatterns = [
      /\b(javascript|typescript|react|vue|angular|node\.?js|python|java|go|rust)\b/gi,
      /\b(api|rest|graphql|sql|nosql|aws|azure|gcp|docker|kubernetes)\b/gi,
      /\b(agile|scrum|ci\/cd|devops|microservices|testing)\b/gi,
    ];

    // Check if resume mentions these keywords
    const resumeText = [
      data.summary || "",
      ...data.experience.flatMap(exp => exp.description),
      ...data.education.map(edu => `${edu.school} ${edu.degree || ""}`),
    ].join(" ").toLowerCase();

    // Find missing keywords
    const missingKeywords: string[] = [];
    keywordPatterns.forEach(pattern => {
      const jobMatches = jobDescriptionLower.match(pattern);
      if (jobMatches) {
        jobMatches.forEach(match => {
          if (!resumeText.includes(match.toLowerCase())) {
            if (!missingKeywords.includes(match)) {
              missingKeywords.push(match);
            }
          }
        });
      }
    });

    // If we found missing keywords (and they're significant), add a warning
    // We'll only flag if there are many missing keywords to avoid false positives
    if (missingKeywords.length > 5) {
      errors.push({
        type: "generic_placeholder", // Reusing this type for keyword mismatch
        message: `Resume may be missing ${missingKeywords.length} keywords found in job description. Consider adding relevant skills/technologies.`,
        field: "summary",
      });
    }
  }

  // Calculate score (0-100)
  // Base score is 100, subtract points for each error
  // Each error type has different weight
  const errorWeights: Record<FTQError["type"], number> = {
    placeholder: 5,
    generic_placeholder: 3,
    missing_contact: 10,
    empty_field: 8,
  };

  const totalDeduction = errors.reduce((sum, error) => {
    return sum + (errorWeights[error.type] || 5);
  }, 0);

  const score = Math.max(0, 100 - totalDeduction);
  const passed = score === 100 && errors.length === 0;

  return {
    score,
    errors,
    passed,
  };
}

