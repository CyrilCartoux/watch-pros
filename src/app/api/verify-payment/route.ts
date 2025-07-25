import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import stripe from '@/lib/stripe/stripe'


export async function POST(request: Request) {
  try {
    const { payment_intent, payment_intent_client_secret, redirect_status } = await request.json()
    
    if (!payment_intent || !payment_intent_client_secret) {
      return NextResponse.json(
        { error: 'Missing payment information' },
        { status: 400 }
      )
    }

    // Retrieve the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent
    )

    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the subscription associated with this payment
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      )
    }

    // Update subscription status based on payment intent status and redirect status
    let newStatus = subscription.status
    if (redirect_status === 'succeeded' || paymentIntent.status === 'succeeded') {
      newStatus = 'active'
    } else if (paymentIntent.status === 'processing') {
      newStatus = 'trialing'
    } else if (paymentIntent.status === 'requires_payment_method') {
      newStatus = 'incomplete'
    } else {
      newStatus = 'incomplete_expired'
    }

    // Get payment method details if available
    let paymentMethodDetails = null

    if (paymentIntent.payment_method && typeof paymentIntent.payment_method === 'string') {
      paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentIntent.payment_method)
    }

    // Prepare payment method details based on type
    let pmType = paymentMethodDetails?.type || null
    let pmLast4 = null
    let pmBrand = null

    if (paymentMethodDetails) {
      if (paymentMethodDetails.type === 'card') {
        pmLast4 = paymentMethodDetails.card?.last4
        pmBrand = paymentMethodDetails.card?.brand
      } else if (paymentMethodDetails.type === 'sepa_debit') {
        pmLast4 = paymentMethodDetails.sepa_debit?.last4
        pmBrand = 'sepa'
      }
    }

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: newStatus,
        payment_method_id: paymentIntent.payment_method as string,
        pm_type: pmType,
        pm_last4: pmLast4,
        pm_brand: pmBrand,
      })
      .eq('id', subscription.id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: paymentIntent.status,
      redirect_status,
      subscriptionStatus: newStatus
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 