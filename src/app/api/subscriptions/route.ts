import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { plans } from '@/data/subscription-plans'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's subscription
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        status,
        pm_type,
        pm_last4,
        pm_brand,
        price_id,
        current_period_start,
        current_period_end
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    // If no subscription found, return null
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        subscription: null
      })
    }

    const subscription = subscriptions[0]

    // Format dates for frontend
    const formattedSubscription = {
      ...subscription,
      plan: plans.find(plan => plan.priceId === subscription.price_id),
      current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start).toISOString() : null,
      current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end).toISOString() : null
    }

    return NextResponse.json({
      subscription: formattedSubscription
    })
  } catch (error) {
    console.error('Error in subscription API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 