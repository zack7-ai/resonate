-- Create database schema for Resonate
-- Run this BEFORE 01_security.sql

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'free',
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  version_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'applied',
  job_description_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recruiters table
CREATE TABLE IF NOT EXISTS recruiters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  linkedin_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiters_user_id ON recruiters(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);

-- Enable Row Level Security on all tables
-- Note: These policies use auth.uid() which requires Supabase Auth integration.
-- If using Clerk exclusively, you may need to:
-- 1. Set up Clerk JWT integration with Supabase (configure Supabase to accept Clerk JWTs)
-- 2. Or use application-level authorization checks instead of RLS
-- 3. Or create custom RLS functions that map Clerk user_id to Supabase auth.uid()
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiters ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own profile"
  ON profiles FOR DELETE
  USING (auth.uid()::text = user_id);

-- Resumes table policies
CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON resumes FOR DELETE
  USING (auth.uid()::text = user_id);

-- Jobs table policies
CREATE POLICY "Users can view their own jobs"
  ON jobs FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own jobs"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own jobs"
  ON jobs FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own jobs"
  ON jobs FOR DELETE
  USING (auth.uid()::text = user_id);

-- Recruiters table policies
CREATE POLICY "Users can view their own recruiters"
  ON recruiters FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own recruiters"
  ON recruiters FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own recruiters"
  ON recruiters FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own recruiters"
  ON recruiters FOR DELETE
  USING (auth.uid()::text = user_id);

-- Note: Ensure foreign keys are set up with ON DELETE CASCADE for cascading deletes
-- Example schema should include:
-- ALTER TABLE resumes ADD CONSTRAINT fk_resumes_user_id FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
-- ALTER TABLE jobs ADD CONSTRAINT fk_jobs_user_id FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
-- ALTER TABLE recruiters ADD CONSTRAINT fk_recruiters_user_id FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

