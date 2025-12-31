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
    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'resumeText and jobDescription are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are an expert recruiter and resume analyst. Analyze the match between a resume and job description and return ONLY a valid JSON object with this exact structure:

{
  "score": 75,
  "missingKeywords": ["Python", "React", "AWS"],
  "advice": "Your resume matches well, but you're missing some key technical skills mentioned in the job description."
}

Rules:
- score: A number from 0-100 indicating how well the resume matches the job requirements
- missingKeywords: An array of important keywords/skills from the job description that are NOT found in the resume (max 10 items)
- advice: A brief, actionable sentence providing guidance on how to improve the match

Be strict but fair. A score of 80+ means excellent match, 50-79 means good match with some gaps, below 50 means significant mismatch.`;

    const userPrompt = `Resume Text:
${resumeText}

Job Description:
${jobDescription}

Analyze the match and return the JSON object.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the JSON response
    const aiResponse = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    
    // Try to parse JSON (handle markdown code blocks if present)
    let matchResult;
    try {
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const jsonString = jsonMatch[1] || aiResponse;
      matchResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to analyze match score' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Validate the result structure
    if (typeof matchResult.score !== 'number' || 
        !Array.isArray(matchResult.missingKeywords) ||
        typeof matchResult.advice !== 'string') {
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(matchResult, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ Match Score Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate match score',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


