import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the "Admin" client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 1. Handle Preflight Requests (CORS)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: corsHeaders,
  });
}

// 2. Handle the Job Capture
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("🔥 HUNT: Received Job Target:", body);

    // FETCH A FALLBACK USER (Since Extension has no login)
    // We grab the first user we find in the database to assign this job to.
    const { data: users, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error("❌ No users found to assign job to.");
      return NextResponse.json({ error: "No User Found" }, { 
        status: 500,
        headers: corsHeaders,
      });
    }

    const targetUserId = users[0].user_id;
    console.log("✅ Assigning Target to Commander ID:", targetUserId);

    // INSERT THE JOB (Using Admin Client)
    // Note: Using job_description_text based on the schema, and status should be lowercase
    const { data: insertedJob, error: insertError } = await supabaseAdmin
      .from('jobs')
      .insert({
        user_id: targetUserId,
        title: body.title || "Unknown Target",
        company: body.company || extractCompanyFromTitle(body.title) || "Unknown Host",
        job_description_text: body.description || body.jobDescription || "Captured via Resonate Hunter",
        status: "applied",
        created_at: new Date().toISOString(),
      })
      .select() // CRITICAL: Ask DB to return the row
      .single();

    if (insertError) {
      console.error("❌ Database Save Failed:", JSON.stringify(insertError, null, 2));
      return NextResponse.json({ 
        error: insertError.message,
        details: insertError 
      }, { 
        status: 500,
        headers: corsHeaders,
      });
    }

    console.log("🚀 Target Secured in Database:", insertedJob);
    return NextResponse.json({ 
      success: true, 
      message: "Target acquired",
      job: insertedJob 
    }, {
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("🔥 SERVER CRASH:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}

// Helper function to extract company name from title
function extractCompanyFromTitle(title: string): string {
  if (!title) return "Unknown Company";
  
  // Try to extract company name from common patterns
  // e.g., "Software Engineer at Google" -> "Google"
  // e.g., "Google - Software Engineer" -> "Google"
  
  const patterns = [
    /at\s+([A-Z][A-Za-z\s&]+?)(?:\s*[-–—]|\s*$|,)/i,
    /^([A-Z][A-Za-z\s&]+?)\s*[-–—]/,
    /^([A-Z][A-Za-z\s&]+?)\s*:/,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: use first few words or "Unknown"
  const words = title.split(/\s+/);
  if (words.length > 0) {
    return words.slice(0, 2).join(" ") || "Unknown Company";
  }

  return "Unknown Company";
}
