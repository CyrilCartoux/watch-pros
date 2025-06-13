import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SubscriptionStatus } from '@/types/db/subscriptions/Subscriptions'

export async function GET() {
  const supabase = await createClient()

  try {
    console.log('GET AUTH STATUS')
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.log('NO USER')
      return NextResponse.json({
        isAuthenticated: false,
        isSeller: false,
        isVerified: false,
        isRejected: false,
        hasActiveSubscription: false
      })
    }
    console.log('USER', user)

    // Get user's profile, seller status and subscription in a single query
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        seller_id,
        sellers (
          identity_verified,
          identity_rejected
        ),
        subscriptions (
          status
        )
      `)
      .eq('id', user.id)
      .single()
    console.log('PROFILE', profile)

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const activeSubscriptionStatuses: SubscriptionStatus[] = ['active', 'incomplete']
    const hasActiveSubscription = profile?.subscriptions?.some(
      (sub: { status: SubscriptionStatus }) => activeSubscriptionStatuses.includes(sub.status)
    ) || false

    console.log('HAS ACTIVE SUBSCRIPTION', hasActiveSubscription)
    console.log('IS VERIFIED', (profile?.sellers as any)?.identity_verified)
    console.log('IS REJECTED', (profile?.sellers as any)?.identity_rejected)
    console.log('IS SELLER', !!profile?.seller_id)


    return NextResponse.json({
      isAuthenticated: true,
      isSeller: !!profile?.seller_id,
      isVerified: (profile?.sellers as any)?.identity_verified || false,
      isRejected: (profile?.sellers as any)?.identity_rejected || false,
      hasActiveSubscription
    })

  } catch (error) {
    console.error('Error in auth status check:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 