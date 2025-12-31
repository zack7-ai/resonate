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
    const { currentBullet, jobDescription, tone = 'Assertive' } = body;

    if (!currentBullet || currentBullet.trim().length === 0) {
      return NextResponse.json(
        { error: 'currentBullet is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Build the system prompt
    let systemPrompt = `You are an expert executive resume writer specializing in the Harvard/McKinsey standard format. Your job is to rewrite resume bullet points to be:
- Result-oriented and quantifiable (include metrics, percentages, dollar amounts when possible)
- Action-verb driven (start with powerful verbs like "Orchestrated", "Architected", "Spearheaded", "Optimized")
- Concise and impactful (one sentence, no fluff)
- Professional and executive-level in tone

The rewritten bullet should sound confident and achievement-focused.`;

    if (jobDescription) {
      systemPrompt += `\n\nCRITICAL: A job description is provided. You MUST naturally include 1-2 relevant keywords from the job description that apply to this bullet point. Align the terminology to match what the employer is looking for. DO NOT fabricate skills or experiences that aren't implied by the original bullet. Only incorporate keywords that logically fit.`;
    }

    // Build the user prompt
    let userPrompt = `Rewrite this resume bullet point in an executive, result-oriented style:\n\n"${currentBullet}"`;

    if (jobDescription) {
      userPrompt += `\n\nThe user is applying for a job with this description:\n${jobDescription}\n\nYou MUST naturally include 1-2 keywords from this description that apply to the bullet. Align the terminology without lying.`;
    }

    if (tone && tone !== 'Assertive') {
      userPrompt += `\n\nTone preference: ${tone}`;
    }

    userPrompt += `\n\nReturn ONLY the rewritten bullet point text, nothing else. Make it compelling and executive-level.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the rewritten text
    const rewrittenText =
      message.content[0].type === 'text'
        ? message.content[0].text.trim()
        : currentBullet; // Fallback if something goes wrong

    // Generate a brief explanation (optional - we can make this smarter)
    const explanation = jobDescription
      ? `Optimized for job requirements with relevant keywords integrated`
      : `Enhanced with executive-level language and action verbs`;

    return NextResponse.json(
      {
        rewrittenText,
        explanation,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ AI Rewrite Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to rewrite bullet point',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

