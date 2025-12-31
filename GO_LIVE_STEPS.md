# Go-Live Steps - Quick Reference

## ✅ STEP 1: The "Keys" (Already Done!)
Your `.env.local` file is configured with:
- ✅ Clerk API keys
- ✅ Supabase URL and key
- ✅ Anthropic API key
- ⏳ Stripe (optional)

---

## 📋 STEP 2: The "Brain" (Setup the Database)

### Locate the Migration File
The SQL migration file is located at:
```
supabase/migrations/01_security.sql
```

### Run it in Supabase:

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project** (sxkembpsppxrpqcxuupk)
3. **Click "SQL Editor"** in the left sidebar
4. **Click "New Query"**
5. **Copy the entire contents** of `supabase/migrations/01_security.sql`
6. **Paste into the SQL Editor**
7. **Click "Run"** (or press Cmd/Ctrl + Enter)

**Expected Result**: "Success, no rows returned."

### ✅ Critical Check:
1. Go to **Table Editor** in Supabase sidebar
2. Verify you see these tables:
   - ✅ `profiles`
   - ✅ `resumes`
   - ✅ `jobs`
   - ✅ `recruiters`

If you see all 4 tables, the database is ready!

---

## 🚀 STEP 3: The "Ignition" (Run the App)

### Start the Development Server:

```bash
cd /Users/zackb/Desktop/Resonate/resonate
npm run dev
```

### The "Smoke Test":

1. **Landing Page**: 
   - Open http://localhost:3000
   - ✅ Does it load?
   - ✅ Do you see the "RezPulse" (glowing green orb)?
   - ✅ Do you see "Stop Guessing. Start Resonating." headline?

2. **Auth Test**:
   - Click "Initialize Launch Sequence"
   - ✅ Does Clerk sign-in window pop up?

3. **Onboarding Test**:
   - Create a test account
   - ✅ Does it redirect to `/launch`?
   - ✅ Do you see the onboarding wizard?

---

## 🎯 STEP 4: Load "The Hunter" (Chrome Extension)

1. **Open Google Chrome**
2. **Navigate to**: `chrome://extensions`
3. **Toggle "Developer Mode"** (top right corner)
4. **Click "Load unpacked"** (top left)
5. **Select the folder**: `/Users/zackb/Desktop/Resonate/resonate/extension`
6. **Verify**: 
   - ✅ Extension appears in the list
   - ✅ "Resonate - The Hunter" icon appears in Chrome toolbar
   - ✅ Click the icon - does the dark sidebar popup open?
   - ✅ Do you see the RezPulse animation in the header?

---

## ✅ STEP 5: The "First Time Quality" Test

1. **Navigate to**: http://localhost:3000/resume/builder
   - (Or go through the launch flow)

2. **Test the PDF Preview**:
   - Fill in the "Name" field
   - ✅ Does the PDF on the right update instantly?

3. **Test FTQ Checker**:
   - Add an Experience entry
   - In the description, type: `[Insert Your Achievement Here]`
   - Click "Run FTQ Check"
   - ✅ Does RezPulse turn RED?
   - ✅ Does an error modal appear showing the placeholder error?

4. **Test Success State**:
   - Remove the placeholder
   - Fill in all required fields properly
   - Click "Run FTQ Check" again
   - ✅ Does RezPulse turn GREEN?
   - ✅ Does the success modal appear?

---

## 🔧 Troubleshooting

### "Auth Error" / "Clerk Error"
- ✅ Check `.env.local` has correct Clerk keys
- ✅ Restart dev server: `Ctrl+C` then `npm run dev`
- ✅ Clear browser cache and try again

### "Database Error" / "Supabase Error"
- ✅ Did you run the SQL migration in Supabase?
- ✅ Check the Table Editor - do you see the 4 tables?
- ✅ Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### "Module Not Found"
```bash
npm install
npm run dev
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 🎉 Alpha Milestone

**You're officially in Alpha when:**
- ✅ Landing page loads at http://localhost:3000
- ✅ You can click "Initialize Launch Sequence"
- ✅ Clerk sign-in window appears
- ✅ You can create an account and log in

**Tell me when you reach this stage!**


