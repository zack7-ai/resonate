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
    const { question, userAnswer, jobDescription, questionCategory } = body;

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'question and userAnswer are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are an executive interview coach and career advisor. Evaluate interview answers and provide constructive, actionable feedback.

Return ONLY a valid JSON object with this exact structure:

{
  "grade": "B",
  "feedback": "Your answer demonstrates solid experience, but could be more strategic. Consider quantifying the impact more specifically.",
  "improvements": [
    "Add specific metrics or percentages to quantify your impact",
    "Frame the situation in more strategic business terms",
    "Emphasize the leadership and cross-functional collaboration aspects"
  ],
  "starMethodCheck": {
    "situation": true,
    "task": true,
    "action": true,
    "result": false
  }
}

Guidelines:
- grade: A (Excellent), B (Good with minor improvements), C (Needs work), D (Significant gaps), F (Incomplete)
- feedback: 2-3 sentences of constructive feedback
- improvements: Array of 2-4 specific, actionable improvement suggestions
- starMethodCheck: Object indicating which STAR elements are present (Situation, Task, Action, Result)
- Be encouraging but honest - help the candidate sound more executive-level`;

    const userPrompt = `Question: ${question}
Category: ${questionCategory || 'behavioral'}

Job Description Context:
${jobDescription || 'No specific job context provided'}

Candidate's Answer:
${userAnswer}

Evaluate this answer and provide feedback. Focus on helping the candidate sound more strategic and executive-level.`;

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
    
    // Try to parse JSON
    let feedbackResult;
    try {
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const jsonString = jsonMatch[1] || aiResponse;
      feedbackResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to generate feedback' },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(feedbackResult, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ Interview Feedback Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate feedback',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


