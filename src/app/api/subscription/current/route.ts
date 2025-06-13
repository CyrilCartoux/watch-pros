import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  try {
    // Vérifier l'authentification
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer la souscription active avec les détails du plan
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans!price_id (
          max_listings
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError)
      return NextResponse.json({ error: 'Erreur lors de la récupération de la souscription' }, { status: 500 })
    }

    // Si pas de souscription active
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ 
        hasActiveSubscription: false,
        subscription: null
      })
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: subscriptions[0]
    })

  } catch (error) {
    console.error('Error in subscription API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 