import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // Count active subscriptions
    const { count: activeSubscriptions, error: countError } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (countError) {
      console.error('Error counting active subscriptions:', countError)
      return NextResponse.json(
        { error: 'Failed to count subscriptions' },
        { status: 500 }
      )
    }

    // Configuration for early bird offer
    const TOTAL_SPOTS = 20 // Total spots available for early bird pricing
    const remainingSpots = Math.max(0, TOTAL_SPOTS - (activeSubscriptions || 0))

    return NextResponse.json({
      activeSubscriptions: activeSubscriptions || 0,
      totalSpots: TOTAL_SPOTS,
      remainingSpots: remainingSpots
    })
  } catch (error) {
    console.error('Error in places-left API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 