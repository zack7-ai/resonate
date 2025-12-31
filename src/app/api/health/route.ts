import { NextResponse } from "next/server";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    { 
      status: "ok", 
      message: "Command Center is online",
      timestamp: new Date().toISOString()
    },
    { 
      status: 200,
      headers: corsHeaders,
    }
  );
}

