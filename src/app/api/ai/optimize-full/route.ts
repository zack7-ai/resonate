import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ResumeData, Experience } from '@/stores/useResumeStore';

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
    const { currentResume, jobDescription } = body;

    if (!currentResume || !jobDescription) {
      return NextResponse.json(
        { error: 'currentResume and jobDescription are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const systemPrompt = `You are an expert executive resume optimizer. Your job is to align a resume with a specific job description by:

1. Analyzing the job description to identify the top 5-7 most important keywords/skills
2. Rewriting the Professional Summary to align with the role's requirements and incorporate 2-3 relevant keywords naturally
3. Optimizing the most recent 3 experience entries' bullet points to include relevant keywords from the job description
4. Maintaining authenticity - only incorporate keywords that logically fit the candidate's actual experience
5. Making the resume sound more strategic and executive-level

Return ONLY a valid JSON object with this structure:
{
  "optimizedSummary": "The rewritten professional summary...",
  "optimizedExperience": [
    {
      "index": 0,
      "optimizedBullets": ["bullet 1", "bullet 2", "bullet 3"]
    }
  ],
  "topKeywords": ["keyword1", "keyword2", "keyword3"]
}

Rules:
- optimizedSummary: Rewrite the summary to align with the job, incorporating 2-3 keywords naturally (2-3 sentences)
- optimizedExperience: Array of objects for the most recent 3 jobs. Each object has index (which experience entry, 0-based) and optimizedBullets (array of rewritten bullet points)
- topKeywords: Array of 5-7 most important keywords from the job description
- Only optimize bullets that exist - don't add new ones
- Keep the same number of bullets per experience entry`;

    const resumeText = `
Name: ${currentResume.name || ''}
Summary: ${currentResume.summary || ''}

Experience:
${currentResume.experience?.slice(0, 3).map((exp: Experience, idx: number) => `
[${idx}] ${exp.title} at ${exp.company}
Bullets:
${exp.description?.join('\n') || ''}
`).join('\n') || 'No experience listed'}

Job Description:
${jobDescription}
    `.trim();

    const userPrompt = `Analyze this resume and job description. Return the optimized JSON structure.`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `${resumeText}\n\n${userPrompt}`,
        },
      ],
    });

    // Extract the JSON response
    const aiResponse = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
    
    // Try to parse JSON
    let optimizationResult;
    try {
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const jsonString = jsonMatch[1] || aiResponse;
      optimizationResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to optimize resume' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Build the optimized resume structure
    const optimizedResume: ResumeData = {
      ...currentResume,
      summary: optimizationResult.optimizedSummary || currentResume.summary,
      experience: currentResume.experience?.map((exp: Experience, idx: number) => {
        const optimization = optimizationResult.optimizedExperience?.find((opt: { index: number; optimizedBullets?: string[] }) => opt.index === idx);
        if (optimization && optimization.optimizedBullets) {
          return {
            ...exp,
            description: optimization.optimizedBullets,
          };
        }
        return exp;
      }) || currentResume.experience,
    };

    return NextResponse.json(
      {
        optimizedResume,
        topKeywords: optimizationResult.topKeywords || [],
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Global Optimize Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to optimize resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}


