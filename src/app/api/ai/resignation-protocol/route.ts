import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { 
      currentRole, 
      company, 
      reason, 
      noticePeriodDays,
      relationshipWithManager,
      exitStrategy
    } = await req.json();

    if (!currentRole || !company) {
      return NextResponse.json(
        { error: 'Current role and company are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a career strategist helping a professional create a resignation protocol - a strategic plan for leaving their current role professionally and preserving relationships.

Current Role: ${currentRole}
Company: ${company}
Notice Period: ${noticePeriodDays || 14} days
Reason for Leaving: ${reason || 'Career advancement'}
Relationship with Manager: ${relationshipWithManager || 'Professional'}
Exit Strategy: ${exitStrategy || 'Standard resignation'}

Create a comprehensive resignation protocol. The protocol should be structured as JSON with the following format:
{
  "summary": "Brief overview of the resignation strategy",
  "timeline": {
    "dayMinus30": "What to do 30 days before",
    "dayMinus14": "What to do 14 days before (notice period start)",
    "dayMinus7": "What to do 7 days before",
    "day0": "Resignation day actions",
    "dayPlus1": "Day after resignation actions",
    "dayPlus7": "Week after resignation",
    "dayPlus14": "Two weeks after (final day)",
    "dayPlus30": "One month after - follow-up actions"
  },
  "resignationLetter": {
    "subject": "Subject line for resignation email",
    "body": "Professional resignation letter template (3-4 paragraphs)",
    "tone": "Professional, grateful, concise"
  },
  "conversationScript": {
    "managerMeeting": "Script for in-person conversation with manager",
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "whatToSay": "Suggested opening and key phrases",
    "whatNotToSay": ["Avoid saying X", "Avoid saying Y"]
  },
  "transitionPlan": {
    "knowledgeTransfer": ["Item 1", "Item 2", "Item 3"],
    "documentation": ["Document 1", "Document 2"],
    "handoffTasks": ["Task 1", "Task 2"]
  },
  "relationshipPreservation": {
    "colleagues": "How to maintain relationships with colleagues",
    "manager": "How to maintain relationship with manager",
    "clients": "How to handle client relationships if applicable",
    "linkedinRecommendations": "When and how to request recommendations"
  },
  "legalConsiderations": [
    "Legal consideration 1",
    "Legal consideration 2"
  ],
  "checklist": [
    "Task 1",
    "Task 2",
    "Task 3"
  ]
}

Make the protocol professional, strategic, and focused on preserving relationships while making a clean exit.`;

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

    const protocolData = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ protocol: protocolData });
  } catch (error) {
    console.error('Error generating resignation protocol:', error);
    return NextResponse.json(
      { error: 'Failed to generate resignation protocol' },
      { status: 500 }
    );
  }
}
