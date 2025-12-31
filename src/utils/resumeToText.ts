import { ResumeData } from "@/stores/useResumeStore";

/**
 * Converts resume data structure to plain text for AI analysis
 */
export function resumeDataToText(data: ResumeData): string {
  let text = "";

  // Name and contact
  if (data.name) text += `${data.name}\n`;
  if (data.email) text += `${data.email}\n`;
  if (data.phone) text += `${data.phone}\n`;
  if (data.location) text += `${data.location}\n`;
  if (data.linkedin) text += `LinkedIn: ${data.linkedin}\n`;
  if (data.website) text += `Website: ${data.website}\n`;
  text += "\n";

  // Summary
  if (data.summary) {
    text += `SUMMARY\n${data.summary}\n\n`;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    text += "EXPERIENCE\n";
    data.experience.forEach((exp) => {
      text += `${exp.title}\n`;
      text += `${exp.company}`;
      if (exp.location) text += `, ${exp.location}`;
      text += "\n";
      if (exp.startDate || exp.endDate) {
        text += `${exp.startDate || ""} - ${exp.endDate || "Present"}\n`;
      }
      if (exp.description && exp.description.length > 0) {
        exp.description.forEach((desc) => {
          if (desc.trim()) {
            text += `• ${desc}\n`;
          }
        });
      }
      text += "\n";
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    text += "EDUCATION\n";
    data.education.forEach((edu) => {
      if (edu.degree) text += `${edu.degree}`;
      if (edu.field) text += ` in ${edu.field}`;
      text += "\n";
      text += `${edu.school}`;
      if (edu.location) text += `, ${edu.location}`;
      text += "\n";
      if (edu.startDate || edu.endDate) {
        text += `${edu.startDate || ""} - ${edu.endDate || "Present"}\n`;
      }
      text += "\n";
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    text += "SKILLS\n";
    text += data.skills.join(", ");
    text += "\n";
  }

  return text.trim();
}


