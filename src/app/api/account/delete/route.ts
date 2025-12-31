import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerClient, getUserId } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = await createServerClient();

    // Delete all user data from Supabase (cascading delete)
    // Note: Ensure foreign keys are set up with ON DELETE CASCADE in your database schema
    
    // Delete recruiters
    await supabase
      .from("recruiters")
      .delete()
      .eq("user_id", userId);

    // Delete jobs
    await supabase
      .from("jobs")
      .delete()
      .eq("user_id", userId);

    // Delete resumes
    await supabase
      .from("resumes")
      .delete()
      .eq("user_id", userId);

    // Delete profile (should be last)
    await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    // Delete Clerk account
    const clerk = await clerkClient();
    await clerk.users.deleteUser(userId);

    return NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}


