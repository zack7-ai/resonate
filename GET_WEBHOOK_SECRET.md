# How to Get Your Stripe Webhook Secret

Since you're using **LIVE (production) Stripe keys**, here are two methods to get your webhook secret:

## Method 1: Stripe Dashboard (Recommended for Production)

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"** (or select an existing endpoint)
3. **Configure the endpoint**:
   - **Endpoint URL**: `https://your-production-domain.com/api/webhooks/stripe`
     - For now, you can use: `https://your-domain.com/api/webhooks/stripe`
     - You'll update this with your actual domain later
   - **Description**: "Resonate Subscription Webhooks" (optional)
4. **Select events to listen to**:
   - Click "Select events"
   - Choose: `checkout.session.completed`
   - Click "Add events"
5. **Click "Add endpoint"**
6. **Copy the Signing secret**:
   - After creating the endpoint, you'll see a "Signing secret" (starts with `whsec_...`)
   - Click "Reveal" or "Click to reveal" to see the full secret
   - **Copy this secret** - you'll need it in the next step

## Method 2: Stripe CLI (For Local Testing)

If you want to test locally first:

1. **Install Stripe CLI**:
   ```bash
   # On macOS with Homebrew:
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Run the listener**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copy the webhook secret** from the output (starts with `whsec_...`)

## Update .env.local

Once you have the webhook secret, update your `.env.local` file:

```bash
# Open .env.local and replace:
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

## Quick Update Command

After you have the webhook secret, run this command (replace `whsec_...` with your actual secret):

```bash
cd /Users/zackb/Desktop/Resonate/resonate
sed -i '' 's|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE|' .env.local
```

Or manually edit `.env.local` and replace the `whsec_...` placeholder.

## Verify Configuration

After updating, verify your Stripe keys are set:

```bash
grep "STRIPE" .env.local
```

You should see:
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- ✅ `STRIPE_SECRET_KEY=sk_live_...`
- ✅ `STRIPE_WEBHOOK_SECRET=whsec_...`
- ✅ `NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/...`

## Next Steps

1. ✅ Get webhook secret (use one of the methods above)
2. ✅ Update `.env.local` with the webhook secret
3. ⏳ Update payment link to LIVE version (optional but recommended)
4. ✅ Restart your dev server: `npm run dev`


