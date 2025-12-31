# Stripe Setup - Next Steps

## ✅ Completed
- Stripe API keys added to `.env.local`:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (LIVE key)
  - `STRIPE_SECRET_KEY` (LIVE key)

## ⏳ Still Needed

### 1. Get Webhook Secret

**Option A: Using Stripe CLI (for local testing)**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copy the `whsec_...` secret and update `.env.local`

**Option B: Using Stripe Dashboard (for production)**
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Set endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the "Signing secret" (starts with `whsec_`)
6. Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### 2. Update Payment Link (Optional but Recommended)

**Current Issue**: You're using LIVE keys with a TEST payment link.

**To Fix**:
1. Go to Stripe Dashboard > Products > Payment Links
2. Create a NEW payment link (or use existing LIVE link)
3. Update `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your-live-link
   ```

## Testing the Setup

Once you've added the webhook secret:

1. **Start dev server**: `npm run dev`
2. **Start Stripe listener** (if testing locally): `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. **Try a premium feature** - should show upgrade modal
4. **Click upgrade** - should redirect to payment page
5. **Use test card** (if using test mode) or real card (if using live mode)
6. **Check webhook events** - should see events in Stripe CLI or Dashboard
7. **Verify database** - user's `subscription_status` should update to `'active'`

## Security Notes

⚠️ **LIVE Keys**: You're using production Stripe keys. Make sure:
- `.env.local` is in `.gitignore` (already done)
- Never commit these keys to version control
- For production deployment, add these as environment variables in your hosting platform (Vercel, etc.)
