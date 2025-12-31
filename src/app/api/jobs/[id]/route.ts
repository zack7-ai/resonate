import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the "Admin" client to bypass RLS for now
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Fetch a single job by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { 
        status: 400,
        headers: corsHeaders,
      });
    }

    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('❌ Error fetching job:', error);
      return NextResponse.json({ error: error.message }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { 
        status: 404,
        headers: corsHeaders,
      });
    }

    return NextResponse.json({ job }, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('❌ API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}

