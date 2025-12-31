-- Add current_salary column to profiles table
-- This allows users to track their current compensation for market value comparisons

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_salary INTEGER DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN profiles.current_salary IS 'User current annual salary in USD for market value benchmarking';

