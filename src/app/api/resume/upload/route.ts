import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF (use require for CommonJS module)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. The PDF may be image-based or corrupted.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if this is a LinkedIn PDF export
    const isLinkedInPDF = rawText.includes('LinkedIn') || rawText.includes('www.linkedin.com/in/') || rawText.toLowerCase().includes('linkedin');

    // Build system prompt with LinkedIn-specific instructions if detected
    let linkedInContext = '';
    if (isLinkedInPDF) {
      linkedInContext = `Context: This is a LinkedIn PDF export. Important parsing guidelines:
1. The 'Summary' section is often at the top, directly under a "Summary" heading
2. 'Experience' entries are listed chronologically (most recent first)
3. 'Skills' are usually at the very bottom in a block or section
4. Ignore footer text like "Page x of y" and navigation elements
5. Map 'Projects' or 'Publications' sections to Experience if they contain role-like information
6. LinkedIn exports often have structured formatting - respect section boundaries
7. Dates may be in various formats (e.g., "Jan 2020", "January 2020", "2020-01") - normalize to MM/YYYY format

`;
    }

    const systemPrompt = `${linkedInContext}You are an expert at parsing resumes and extracting structured data. Extract information from the resume text and return ONLY a valid JSON object with this exact structure:

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number or empty string",
  "location": "City, State or empty string",
  "linkedin": "LinkedIn URL or empty string",
  "website": "Website URL or empty string",
  "summary": "Professional summary paragraph or empty string",
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, State",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": ["bullet point 1", "bullet point 2", ...]
    }
  ],
  "education": [
    {
      "school": "School Name",
      "degree": "Degree Type (e.g., B.S., M.S.)",
      "field": "Field of Study",
      "location": "City, State",
      "startDate": "YYYY",
      "endDate": "YYYY or Present"
    }
  ],
  "skills": ["Skill 1", "Skill 2", ...]
}

Rules:
- Return ONLY the JSON, no markdown, no code blocks, no explanations
- If a field is not found, use an empty string or empty array
- For dates, use the format specified (MM/YYYY for experience, YYYY for education)
- Extract all experience entries and education entries
- Skills should be an array of strings
- Description bullets should be an array of strings`;

    const userPrompt = `Extract the resume data from this text:\n\n${rawText}`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
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
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponse];
      const jsonString = jsonMatch[1] || aiResponse;
      parsedData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse resume data. Please try again or enter manually.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Transform the data to match our ResumeData structure
    const transformedData = {
      name: parsedData.name || '',
      email: parsedData.email || '',
      phone: parsedData.phone || '',
      location: parsedData.location || '',
      linkedin: parsedData.linkedin || '',
      website: parsedData.website || '',
      summary: parsedData.summary || '',
      experience: (parsedData.experience || []).map((exp: { company?: string; title?: string; location?: string; startDate?: string; endDate?: string; description?: string[] }, index: number) => ({
        id: `exp-${Date.now()}-${index}`,
        company: exp.company || '',
        title: exp.title || '',
        location: exp.location || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: Array.isArray(exp.description) ? exp.description : [],
      })),
      education: (parsedData.education || []).map((edu: { school?: string; degree?: string; field?: string; location?: string; startDate?: string; endDate?: string }, index: number) => ({
        id: `edu-${Date.now()}-${index}`,
        school: edu.school || '',
        degree: edu.degree || '',
        field: edu.field || '',
        location: edu.location || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      })),
      skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
    };

    return NextResponse.json(
      { data: transformedData },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Resume Upload Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to parse resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

