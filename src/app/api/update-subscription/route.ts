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

    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Récupérer la souscription active
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Récupérer les détails de la souscription Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id
    )

    // Mettre à jour la souscription Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: priceId,
          },
        ],
      }
    )

    // Mettre à jour la souscription dans la base de données
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        price_id: priceId,
        product_id: updatedSubscription.items.data[0].price.product,
        current_period_start: new Date(updatedSubscription.items.data[0].current_period_start * 1000).toISOString(),
        current_period_end: new Date(updatedSubscription.items.data[0].current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.stripe_subscription_id)

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription in database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription
    })

  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
} 