import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { resumeData, currentRole, targetRole, careerGoals } = await req.json();

    if (!resumeData || !targetRole) {
      return NextResponse.json(
        { error: 'Resume data and target role are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a career strategist helping a professional create a 90-day career transition plan.

Current Role: ${currentRole || 'Not specified'}
Target Role: ${targetRole}
Career Goals: ${careerGoals || 'Career advancement'}

Resume Summary:
${JSON.stringify(resumeData, null, 2)}

Create a comprehensive 90-day career transition plan. The plan should be structured as JSON with the following format:
{
  "summary": "Brief 2-3 sentence overview of the plan",
  "phases": [
    {
      "title": "Phase 1: Days 1-30",
      "theme": "Foundation Building",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "tasks": [
        {
          "task": "Specific actionable task",
          "priority": "High|Medium|Low",
          "timeline": "Specific timeline or deadline",
          "resources": ["Resource or tool needed"]
        }
      ],
      "milestones": ["Key milestone 1", "Key milestone 2"]
    },
    {
      "title": "Phase 2: Days 31-60",
      "theme": "Skill Development & Networking",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "tasks": [
        {
          "task": "Specific actionable task",
          "priority": "High|Medium|Low",
          "timeline": "Specific timeline or deadline",
          "resources": ["Resource or tool needed"]
        }
      ],
      "milestones": ["Key milestone 1", "Key milestone 2"]
    },
    {
      "title": "Phase 3: Days 61-90",
      "theme": "Execution & Transition",
      "objectives": ["Objective 1", "Objective 2", "Objective 3"],
      "tasks": [
        {
          "task": "Specific actionable task",
          "priority": "High|Medium|Low",
          "timeline": "Specific timeline or deadline",
          "resources": ["Resource or tool needed"]
        }
      ],
      "milestones": ["Key milestone 1", "Key milestone 2"]
    }
  ],
  "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "riskMitigation": ["Risk mitigation strategy 1", "Risk mitigation strategy 2"]
}

Make the plan actionable, specific, and tailored to the user's career transition goals. Focus on practical steps that will lead to success.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
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

    const planData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ plan: planData });
  } catch (error) {
    console.error('Error generating 90-day plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate 90-day plan' },
      { status: 500 }
    );
  }
}
