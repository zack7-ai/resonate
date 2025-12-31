# 🚀 EXECUTE NOW - Alpha Milestone Checklist

## ✅ Pre-Flight Check

- ✅ Code is scaffolded
- ✅ API keys are in `.env.local`
- ✅ Migration files are ready
- ✅ You're in the correct directory

---

## STEP 1: Navigate to Correct Folder ✅

You're already verified! The correct path is:
```bash
cd /Users/zackb/Desktop/Resonate/resonate
```

**Do NOT run `npm run dev` yet** - we need the database first!

---

## STEP 2: Build the Database (Supabase)

### 2A: Run Schema Migration (Creates Tables)

1. **Go to**: https://app.supabase.com/project/sxkembpsppxrpqcxuupk
2. **Click**: "SQL Editor" in left sidebar (terminal icon: >_)
3. **Click**: "New Query" button
4. **Open**: `supabase/migrations/00_schema.sql` in Cursor
5. **Copy**: The ENTIRE file content (all 55 lines)
6. **Paste**: Into Supabase SQL Editor
7. **Click**: "Run" button (bottom right)

**Expected Result**: "Success. No rows returned"

### 2B: Run Security Migration (Sets Up RLS)

1. **Click**: "New Query" again (to start fresh)
2. **Open**: `supabase/migrations/01_security.sql` in Cursor
3. **Copy**: The ENTIRE file content (all 86 lines)
4. **Paste**: Into Supabase SQL Editor
5. **Click**: "Run" button

**Expected Result**: "Success. No rows returned"

### 2C: Verify Tables Were Created ✅

1. **Click**: "Table Editor" in left sidebar (grid icon)
2. **Check**: You should see 4 tables:
   - ✅ `profiles`
   - ✅ `resumes`
   - ✅ `jobs`
   - ✅ `recruiters`

**If all 4 tables appear, your database is ready!**

---

## STEP 3: Ignite the Engine

### Start the Development Server

In your terminal (make sure you're in `/resonate` folder):

```bash
cd /Users/zackb/Desktop/Resonate/resonate
npm run dev
```

**Wait for**: `Ready in [x]ms` message

### Open the App

1. **Open browser**: http://localhost:3000
2. **You should see**: The "Stealth Command" landing page

---

## STEP 4: The Alpha Test 🔬

### Test 1: Landing Page Loads ✅
- [ ] Does the dark "Midnight Slate" background appear?
- [ ] Do you see the RezPulse (glowing green orb)?
- [ ] Do you see "Stop Guessing. Start Resonating." headline?
- [ ] Is the "Initialize Launch Sequence" button visible?

### Test 2: Authentication Works ✅
- [ ] Click "Initialize Launch Sequence"
- [ ] Does Clerk sign-in window pop up?

### Test 3: Sign Up Process ✅
- [ ] Create a test account (use any email)
- [ ] Complete the sign-up form
- [ ] Submit the form

### Test 4: Redirect to Onboarding ✅
- [ ] After sign-up, are you redirected to `/launch`?
- [ ] Do you see the onboarding wizard?
- [ ] Do you see "Upload Resume", "Install Extension", "Set Goal" steps?

---

## 🎉 ALPHA MILESTONE

**If all 4 tests pass, type: "ALPHA CONFIRMED"**

You are officially live in Alpha! 🚀

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Did you run BOTH migration files?
- Check Table Editor - are all 4 tables there?
- Verify `.env.local` has correct Supabase URL and key

### "Clerk authentication error"
- Check `.env.local` has correct Clerk keys
- Restart server: `Ctrl+C` then `npm run dev` again
- Clear browser cache

### "Module not found"
```bash
npm install
npm run dev
```

### Server won't start
- Make sure you're in `/Users/zackb/Desktop/Resonate/resonate`
- Check for syntax errors in console
- Try: `rm -rf .next && npm run dev`


