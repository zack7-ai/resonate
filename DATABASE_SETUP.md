# Database Setup Instructions

## ⚠️ Important: Two-Step Process

You need to run **TWO** migration files in order:

1. **First**: `00_schema.sql` - Creates the tables
2. **Second**: `01_security.sql` - Sets up Row Level Security

---

## Step-by-Step Instructions

### 1. Go to Supabase Dashboard

1. Open: https://app.supabase.com
2. Select your project: **sxkembpsppxrpqcxuupk**
3. Click **"SQL Editor"** in the left sidebar

### 2. Run Schema Migration (Creates Tables)

1. Click **"New Query"** button
2. Open the file: `supabase/migrations/00_schema.sql`
3. **Copy the entire contents** of the file
4. **Paste** into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

**Expected Result**: "Success, no rows returned."

### 3. Run Security Migration (Sets Up RLS)

1. Click **"New Query"** button again
2. Open the file: `supabase/migrations/01_security.sql`
3. **Copy the entire contents** of the file
4. **Paste** into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

**Expected Result**: "Success, no rows returned."

### 4. Verify Tables Were Created

1. Click **"Table Editor"** in the left sidebar
2. You should see **4 tables**:
   - ✅ `profiles`
   - ✅ `resumes`
   - ✅ `jobs`
   - ✅ `recruiters`

If you see all 4 tables, your database is ready! 🎉

---

## Table Schemas Created

### `profiles`
- `user_id` (TEXT, PRIMARY KEY) - Clerk user ID
- `email` (TEXT)
- `subscription_status` (TEXT) - 'free' or 'pro'
- `credits` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMP)

### `resumes`
- `id` (UUID, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY → profiles)
- `content` (JSONB) - Resume data
- `version_name` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### `jobs`
- `id` (UUID, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY → profiles)
- `company` (TEXT)
- `title` (TEXT)
- `status` (TEXT) - e.g., 'applied', 'interview', 'offer'
- `job_description_text` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### `recruiters`
- `id` (UUID, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY → profiles)
- `name` (TEXT)
- `company` (TEXT)
- `linkedin_url` (TEXT)
- `status` (TEXT) - e.g., 'active', 'inactive'
- `created_at`, `updated_at` (TIMESTAMP)

---

## Troubleshooting

### Error: "relation already exists"
- Tables already exist - you can skip `00_schema.sql`
- Just run `01_security.sql` to set up RLS

### Error: "permission denied"
- Make sure you're logged into the correct Supabase project
- Check that you have admin access to the project

### Tables not showing in Table Editor
- Refresh the page
- Make sure you ran BOTH migration files
- Check the SQL Editor for any error messages

---

## Next Steps

Once your tables are created:
1. ✅ Verify all 4 tables exist
2. ✅ Start your dev server: `npm run dev`
3. ✅ Test authentication and database connections


