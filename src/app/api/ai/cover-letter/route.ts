import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resumeData, jobDescription, jobTitle, companyName } = body;

    if (!resumeData || !jobDescription) {
      return NextResponse.json(
        { error: 'resumeData and jobDescription are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are an expert professional cover letter writer. Write compelling, personalized cover letters that connect a candidate's specific experience to job requirements.

Guidelines:
- Tone: Confident but polite, professional
- Length: 3-4 paragraphs (approximately 250-350 words)
- Structure: Opening (why you're interested), Body (relevant experience), Closing (call to action)
- Personalization: Reference specific aspects of the job description
- Authenticity: Base claims on the candidate's actual experience from their resume
- Avoid generic phrases like "I am writing to apply"

Return ONLY the cover letter content as plain text (no JSON wrapper, no markdown formatting).`;

    const resumeSummary = `
Name: ${resumeData.name || 'Candidate'}
Current Role: ${resumeData.experience?.[0]?.title || 'Not specified'}
Company: ${resumeData.experience?.[0]?.company || 'Not specified'}

Summary: ${resumeData.summary || 'No summary provided'}

Key Experience:
${resumeData.experience?.slice(0, 3).map((exp: any) => `
- ${exp.title} at ${exp.company}: ${exp.description?.slice(0, 2).join(' ') || ''}
`).join('\n') || 'No experience listed'}

Skills: ${resumeData.skills?.join(', ') || 'No skills listed'}
    `.trim();

    const userPrompt = `Write a professional cover letter for this candidate applying for the position:

Position: ${jobTitle || 'Open Position'}
Company: ${companyName || 'The Company'}

Job Description:
${jobDescription}

Candidate's Resume:
${resumeSummary}

Write the cover letter content (no salutation/greeting, just start with the first paragraph).`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the cover letter content
    const coverLetterContent =
      message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : '';

    return NextResponse.json(
      { content: coverLetterContent },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Cover Letter Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate cover letter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


