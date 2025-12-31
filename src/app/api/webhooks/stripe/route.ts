import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Disable body parsing for webhook to get raw body for signature verification
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    try {
      let userId: string | null = null;

      // First, try to get user ID from client_reference_id
      if (session.client_reference_id) {
        userId = session.client_reference_id;
      }

      // Fallback: Find user by email
      if (!userId && session.customer_details?.email) {
        const email = session.customer_details.email;
        
        // Try to find user in Supabase profiles by email
        // Note: We need to match with Clerk users, so we'll need to check the email
        // Since Clerk stores user emails separately, we'll use the email to find the profile
        // that matches a Clerk user (this assumes email is stored in profiles or can be matched)
        
        // For now, we'll update by email matching in profiles table
        // In production, you might want to add an email field to profiles or use Clerk user lookup
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('user_id')
          .eq('email', email)
          .single();

        if (profile) {
          userId = profile.user_id;
        }
      }

      if (!userId) {
        console.error('Could not identify user for session:', session.id);
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Update user's subscription status in Supabase
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'active',
          tier: 'premium',
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        );
      }

      console.log(`✅ Subscription activated for user: ${userId}`);
      return NextResponse.json({ received: true, userId });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  // Return success for other event types
  return NextResponse.json({ received: true });
}

