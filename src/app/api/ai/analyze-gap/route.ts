import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume text and job description are required' },
        { status: 400 }
      );
    }

    const prompt = `You are analyzing a resume against a job description to identify keyword matching.

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Analyze the resume and compare it against the job description. Identify:
1. Keywords from the job description that ARE present in the resume (matched keywords)
2. Important keywords from the job description that are MISSING from the resume (missing keywords)

Focus on:
- Technical skills and technologies
- Domain-specific terminology
- Key responsibilities and functions
- Industry-specific terms
- Required qualifications (but prioritize actionable keywords over generic ones)

Return a JSON object with this exact format:
{
  "score": <number between 0-100 representing overall keyword match percentage>,
  "matchedKeywords": ["keyword1", "keyword2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...]
}

Rules:
- Include 5-15 matched keywords (most important ones found in resume)
- Include 5-15 missing keywords (most important ones missing from resume)
- Keywords should be specific and actionable (e.g., "Python", "Agile methodology", "Cloud architecture")
- Avoid generic words (e.g., "communication", "teamwork" - unless specifically emphasized in job description)
- Prioritize technical/professional terms over soft skills
- Return ONLY valid JSON, no additional text`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic');
    }

    // Parse JSON from response
    const text = content.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const analysisData = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      typeof analysisData.score !== 'number' ||
      !Array.isArray(analysisData.matchedKeywords) ||
      !Array.isArray(analysisData.missingKeywords)
    ) {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Error analyzing keyword gap:', error);
    return NextResponse.json(
      { error: 'Failed to analyze keyword gap' },
      { status: 500 }
    );
  }
}


