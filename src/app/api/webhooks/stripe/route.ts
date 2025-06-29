import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import stripe from '@/lib/stripe/stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature');

  console.log('[Stripe Webhook] Reçu:', { signature, body: body.slice(0, 500) })

  if (!signature) {
    console.error('[Stripe Webhook] Signature manquante')
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log('[Stripe Webhook] Event Stripe vérifié:', event.type)
  } catch (err) {
    console.error('[Stripe Webhook] Signature invalide', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription
    console.log('[Stripe Webhook] Subscription event:', {
      id: subscription.id,
      customer: subscription.customer,
      status: subscription.status,
      items: subscription.items?.data?.length
    })

    const stripeCustomerId = subscription.customer as string
    const stripeSubscriptionId = subscription.id
    const priceId = subscription.items.data[0]?.price.id
    const productId = subscription.items.data[0]?.price.product as string
    const status = subscription.status
    const current_period_start = new Date(subscription.items.data[0].current_period_start * 1000).toISOString()
    const current_period_end = new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
    const cancel_at_period_end = subscription.cancel_at_period_end
    const canceled_at = subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null

    // Récupère l'utilisateur lié à ce customer Stripe
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single()

    if (profileError || !profile) {
      console.error('[Stripe Webhook] Utilisateur non trouvé pour customer', stripeCustomerId)
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Upsert la subscription dans la table subscriptions
    const { error: upsertError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: profile.id,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        price_id: priceId,
        product_id: productId,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        canceled_at,
      }, { onConflict: 'stripe_subscription_id' })

    if (upsertError) {
      console.error('[Stripe Webhook] Erreur upsert subscription', upsertError)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la subscription' }, { status: 500 })
    }
    console.log('[Stripe Webhook] Subscription upserted pour user', profile.id)
  }

  return NextResponse.json({ received: true })
} 