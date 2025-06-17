import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import stripe from '@/lib/stripe/stripe'


export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { priceId, account, address } = await request.json()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier que le price_id existe dans subscription_plans
    const { data: subscriptionPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('price_id')
      .eq('price_id', priceId)
      .single()

    if (planError || !subscriptionPlan) {
      console.error('Invalid price_id:', priceId)
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
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
        metadata: { 
          supabaseUserId: user.id,
          companyName: account.companyName,
          companyStatus: account.companyStatus,
          country: address.country,
          firstName: account.firstName,
          lastName: account.lastName,
          phone: account.phone,
          phonePrefix: account.phonePrefix,
          watchProsName: account.watchProsName,
          addressComplement: address.addressComplement,
          city: address.city,
          postalCode: address.postalCode,
          siren: address.siren,
          street: address.street,
          taxId: address.taxId,
          vatNumber: address.vatNumber
        }
      })
      stripeCustomerId = customer.id
      await supabaseAdmin
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