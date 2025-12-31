# 🎯 Alpha Test Checklist

## ✅ Server Status

The development server is starting in the background.

## 📋 Alpha Test Steps

### Step 1: Wait for Server Ready
Look at your terminal for the message:
```
✓ Ready in [x]ms
```

### Step 2: Open Browser
Navigate to: **http://localhost:3000**

### Step 3: Visual Check ✅
You should see:
- [ ] Dark "Midnight Slate" background (#0B1120)
- [ ] RezPulse (glowing green orb animation) in the center
- [ ] Headline: "Stop Guessing. Start Resonating."
- [ ] Subheadline with description
- [ ] "Initialize Launch Sequence" button (glowing blue/green gradient)

### Step 4: Test Authentication ✅
- [ ] Click "Initialize Launch Sequence" button
- [ ] Clerk sign-in/sign-up modal should appear
- [ ] Try creating a test account
- [ ] Complete the sign-up form

### Step 5: Test Redirect ✅
After sign-up:
- [ ] Are you redirected to `/launch`?
- [ ] Do you see the onboarding wizard?
- [ ] Can you see the 3 steps (Upload Resume, Install Extension, Set Goal)?

## 🎉 ALPHA CONFIRMED

**If the landing page loads AND you can sign in/up without errors, type:**

**"ALPHA CONFIRMED"**

---

## 🆘 Troubleshooting

### Server won't start
- Check terminal for error messages
- Make sure you're in: `/Users/zackb/Desktop/Resonate/resonate`
- Try: `npm install` then `npm run dev` again

### "Clerk Error" / Authentication fails
- Check `.env.local` has correct Clerk keys
- Restart server: `Ctrl+C` then `npm run dev`

### "Database Error" / "Supabase Error"
- Did you run the SQL migrations in Supabase?
- Check Table Editor - are all 4 tables there?
- Verify Supabase keys in `.env.local`

### Page won't load / 404
- Make sure server says "Ready"
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check browser console for errors


