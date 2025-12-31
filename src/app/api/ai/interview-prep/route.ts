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
    const { jobDescription, jobTitle, companyName } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'jobDescription is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are an expert interview coach and career advisor. Generate realistic interview questions based on job descriptions and provide strategic guidance using the STAR method (Situation, Task, Action, Result).

Return ONLY a valid JSON object with this exact structure:

{
  "questions": [
    {
      "question": "Tell me about a time when you had to...",
      "tip": "Use the STAR method: Describe the Situation, Task, Action you took, and the Result. Focus on quantifiable outcomes.",
      "category": "behavioral"
    }
  ]
}

Guidelines:
- Generate exactly 5 questions
- Mix of behavioral (60%) and technical/role-specific (40%) questions
- Questions should be directly relevant to the job description
- Tips should be actionable and include STAR method guidance where applicable
- category should be either "behavioral" or "technical"`;

    const userPrompt = `Generate 5 interview questions for this position:

Position: ${jobTitle || 'Open Position'}
Company: ${companyName || 'The Company'}

Job Description:
${jobDescription}

Generate a mix of behavioral and technical questions that would likely be asked in an interview for this specific role.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
    let prepResult;
    try {
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const jsonString = jsonMatch[1] || aiResponse;
      prepResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate interview questions' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Validate the result structure
    if (!Array.isArray(prepResult.questions)) {
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(prepResult, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ Interview Prep Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate interview prep',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


