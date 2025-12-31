import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: 'resumeText is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an executive recruiter conducting a rigorous resume audit. Analyze this resume and evaluate it across three critical dimensions:

1. **IMPACT**: Are bullet points result-oriented with quantifiable metrics (numbers, percentages, dollar amounts, timeframes)?
2. **CLARITY**: Is the language concise, active (using action verbs), and free of jargon?
3. **COMPLETENESS**: Are key sections present (summary, skills, education) and well-developed?

Resume Text:
${typeof resumeText === 'string' ? resumeText : JSON.stringify(resumeText, null, 2)}

Return ONLY a valid JSON object with this exact structure:
{
  "score": <number between 0-100 representing overall resume quality>,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "actionPlan": ["action item 1", "action item 2", "action item 3"]
}

Guidelines:
- score: 80-100 = Excellent, 60-79 = Good but needs improvement, 40-59 = Needs significant work, 0-39 = Poor
- strengths: 3-5 specific positive observations (e.g., "Strong use of metrics in recent roles")
- weaknesses: 3-5 specific issues found (e.g., "3 bullets lack quantifiable results", "Summary is missing or generic")
- actionPlan: 3-5 actionable recommendations (e.g., "Add metrics to 3 experience bullets", "Rewrite summary to highlight key achievements")

Be specific, actionable, and professional in your feedback.`;

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

    const auditResult = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      typeof auditResult.score !== 'number' ||
      !Array.isArray(auditResult.strengths) ||
      !Array.isArray(auditResult.weaknesses) ||
      !Array.isArray(auditResult.actionPlan)
    ) {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(auditResult);
  } catch (error) {
    console.error('Error running resume audit:', error);
    return NextResponse.json(
      { error: 'Failed to run resume audit' },
      { status: 500 }
    );
  }
}


