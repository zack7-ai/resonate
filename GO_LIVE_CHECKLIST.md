# Go-Live Checklist

This checklist will help you connect all the services and get Resonate running.

## STEP 1: The "Keys" (Connect the Services)

### Create `.env.local` File

1. In the root folder (`resonate/`), create a file named `.env.local`
2. Copy the contents from `.env.example` (or use the template below)
3. Fill in all the placeholder values with your actual API keys

### Environment Variables Template

```bash
# CLERK (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/launch
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/launch

# SUPABASE (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ANTHROPIC (The AI Brain)
ANTHROPIC_API_KEY=sk-ant-...

# STRIPE (Payments - Optional for now)
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_...
```

### Where to Get Your Keys

1. **Clerk Keys**: 
   - Go to https://dashboard.clerk.com
   - Create a new application
   - Navigate to API Keys section
   - Copy the Publishable Key and Secret Key

2. **Supabase Keys**:
   - Go to https://supabase.com
   - Create a new project
   - Navigate to Settings > API
   - Copy the Project URL and `anon` `public` key

3. **Anthropic API Key**:
   - Go to https://console.anthropic.com
   - Create an API key
   - Copy the key (starts with `sk-ant-`)

4. **Stripe Payment Link** (Optional):
   - Go to https://dashboard.stripe.com
   - Navigate to Products > Payment Links
   - Create a payment link for $49
   - Copy the link URL

### Important Notes

- `.env.local` is already in `.gitignore` - your keys will NOT be committed to git
- Never commit `.env.local` to version control
- Restart your dev server after creating/updating `.env.local`
- For production, add these variables to your hosting platform (Vercel, etc.)

## STEP 2: Database Setup (Coming Next)

After setting up your keys, you'll need to:
- Run the Supabase migrations
- Set up Row Level Security (RLS) policies
- Create the database tables

## STEP 3: Test the Connection

Once keys are set up:
1. Run `npm run dev`
2. Check the console for any connection errors
3. Try signing up/logging in with Clerk
4. Verify Supabase connection


