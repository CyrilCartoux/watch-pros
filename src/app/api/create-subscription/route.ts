import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { priceId } = await request.json()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()
    let stripeCustomerId = profile?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabaseUserId: user.id }
      })
      stripeCustomerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription', payment_method_types: ['card', 'sepa_debit'] },
      expand: ['latest_invoice.confirmation_secret'],
    });

    console.log('Subscription created:', subscription.id)
    
    // Save subscription details to database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscription.id,
        price_id: priceId,
        product_id: subscription.items.data[0].price.product,
        status: subscription.status,
        current_period_start: new Date(subscription.items.data[0].current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null
      })

    if (subscriptionError) {
      console.error('Error saving subscription to database:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to save subscription details' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.confirmation_secret?.client_secret,
    })
  } catch (error) {
    console.error('Error creating Subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create Subscription' },
      { status: 500 }
    )
  }
} 