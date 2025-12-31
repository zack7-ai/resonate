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

