import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
})

export async function POST(request: Request) {
  try {
    console.log('Starting subscription creation process...')
    const supabase = await createClient()
    
    // 1) Récupérer l'utilisateur Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('User authenticated:', user.id, user.email)

    // 2) Plan choisi
    const { plan } = await request.json()
    console.log('Plan selected:', plan)

    // 3) Créer ou récupérer le Customer Stripe
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

    // 4) Créer la souscription avec SetupIntent
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: plan }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription',
        payment_method_types: ['card', 'sepa_debit']
      },
      expand: ['latest_invoice.confirmation_secret']
    })
    console.log('Subscription created:', subscription.id, subscription.status)

    // 5) Récupérer le secret
    const clientSecret = (subscription.latest_invoice as Stripe.Invoice & {
      confirmation_secret: { client_secret: string }
    }).confirmation_secret?.client_secret

    if (!clientSecret) {
      console.error('No client_secret found in confirmation_secret')
      throw new Error('No client secret generated')
    }

    console.log('Client secret to return:', clientSecret)

    return NextResponse.json({
      clientSecret,
      subscriptionId: subscription.id
    })

  } catch (err: any) {
    console.error('Error creating subscription:', err)
    if (err instanceof Stripe.errors.StripeError) {
      console.error('Stripe error details:', {
        type: err.type,
        code: err.code,
        message: err.message,
        requestId: err.requestId
      })
    }
    return NextResponse.json(
      { error: err.message || 'Failed to create subscription' },
      { status: 500 }
    )
  }
} 