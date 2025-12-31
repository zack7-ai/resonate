import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { jobDescription, resumeSummary, recipientType } = await req.json();

    if (!jobDescription || !resumeSummary || !recipientType) {
      return NextResponse.json(
        { error: 'jobDescription, resumeSummary, and recipientType are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert career strategist writing high-converting outreach messages for job applications.

Job Description:
${jobDescription}

Candidate Summary (from resume):
${resumeSummary}

Recipient Type: ${recipientType}

Generate THREE separate messages:

1. EMAIL SUBJECT LINE
   - Maximum 60 characters
   - Compelling, professional, and specific to this role
   - Should make the recipient want to open the email

2. EMAIL BODY
   - Professional, confident tone (not desperate)
   - 3-4 short paragraphs maximum
   - Opening: Brief introduction and why you're reaching out
   - Middle: 2-3 specific points connecting your background to the role
   - Closing: Clear call-to-action (request for conversation/meeting)
   - Keep it concise and value-focused

3. LINKEDIN CONNECTION NOTE
   - Maximum 300 characters (LinkedIn limit)
   - Professional, warm, and concise
   - Mention the specific role or company
   - Clear value proposition
   - Friendly call-to-action

Return ONLY a valid JSON object with this exact structure:
{
  "emailSubject": "Your subject line here",
  "emailBody": "Your email body here",
  "linkedinNote": "Your LinkedIn note here"
}

Important guidelines:
- Be specific to this role and company (not generic)
- Show you've researched the role
- Highlight relevant experience without being arrogant
- Make it personal and authentic
- Use professional but conversational tone
- Avoid buzzwords and clichés`;

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

    const result = JSON.parse(jsonMatch[0]);

    // Validate the response structure
    if (
      typeof result.emailSubject !== 'string' ||
      typeof result.emailBody !== 'string' ||
      typeof result.linkedinNote !== 'string'
    ) {
      throw new Error('Invalid response structure from AI');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating networking messages:', error);
    return NextResponse.json(
      { error: 'Failed to generate networking messages' },
      { status: 500 }
    );
  }
}


