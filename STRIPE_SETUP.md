# Stripe Setup Guide

## Current Status ✅

Your `.env.local` file has been configured with the Stripe environment variable template. The payment link is already set correctly.

## What You Need to Do

### Step 1: Install Stripe CLI

**Option A: Install via Homebrew (Recommended)**
```bash
brew install stripe/stripe-cli/stripe
```

**Option B: Download from Stripe**
- Visit: https://stripe.com/docs/stripe-cli
- Download the macOS installer
- Follow installation instructions

**Option C: Install via npm (if available)**
```bash
npm install -g stripe-cli
```

### Step 2: Get Your Stripe API Keys

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_...`)
3. Copy your **Secret key** (starts with `sk_test_...`) - Click "Reveal test key" if needed

### Step 3: Get Webhook Signing Secret

1. Open a terminal
2. Make sure your Next.js dev server is running: `npm run dev`
3. Run this command in a **separate terminal window**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. The command will output a webhook signing secret that starts with `whsec_...`
5. **Copy this secret** - you'll need it in the next step
6. Keep this terminal running (it forwards webhook events to your local server)

### Step 4: Update `.env.local`

Open `/Users/zackb/Desktop/Resonate/resonate/.env.local` and replace the placeholders:

```env
# STRIPE (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_aFabJ3alkcC3cSw97BfQI00
```

### Step 5: Restart Your Dev Server

After updating `.env.local`:
```bash
# Stop your current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

## How It Works

1. **Frontend Gating**: The `useSubscription` hook checks if a user has a premium subscription
2. **Upgrade Modal**: When free users try to use premium features, they see the `UpgradeModal`
3. **Payment Link**: The modal links to your Stripe payment page
4. **Webhook Handler**: After payment, Stripe sends a webhook to `/api/webhooks/stripe`
5. **Subscription Activation**: The webhook handler updates the user's `subscription_status` to `'active'` in Supabase

## Testing the Payment Flow

1. **Start your dev server**: `npm run dev`
2. **Start Stripe CLI listener** (in separate terminal): `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. **Try a premium feature** (e.g., PDF Export or AI Auto-Align)
4. **Click the upgrade button** - should redirect to your Stripe payment page
5. **Use Stripe test card**: `4242 4242 4242 4242` (any future date, any CVC)
6. **Check the Stripe CLI terminal** - you should see webhook events being forwarded
7. **Check your database** - user's `subscription_status` should update to `'active'`

## Files Using Stripe

- `src/lib/stripe.ts` - Stripe client initialization (uses `STRIPE_SECRET_KEY`)
- `src/app/api/webhooks/stripe/route.ts` - Webhook handler (uses `STRIPE_WEBHOOK_SECRET`)
- `src/components/ui/UpgradeModal.tsx` - Upgrade modal (uses `NEXT_PUBLIC_STRIPE_PAYMENT_LINK`)
- `src/hooks/useSubscription.ts` - Subscription status hook

## Troubleshooting

**Issue**: Webhook secret not found
- **Solution**: Make sure `stripe listen` is running and you've copied the `whsec_...` secret

**Issue**: Webhook verification fails
- **Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches the secret from `stripe listen`

**Issue**: Payment link doesn't work
- **Solution**: Verify `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` is set correctly in `.env.local`

**Issue**: Subscription not activating after payment
- **Solution**: Check Stripe CLI terminal for webhook events, check server logs for errors


