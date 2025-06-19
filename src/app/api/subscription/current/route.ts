import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer le profil utilisateur avec le seller_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('seller_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.seller_id) {
      return NextResponse.json({ error: 'Profil vendeur non trouvé' }, { status: 404 })
    }

    // Compter les listings actifs et en attente du vendeur
    const { count: activeListingsCount, error: countError } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', profile.seller_id)
      .in('status', ['active', 'hold'])

    if (countError) {
      console.error('Error counting listings:', countError)
      return NextResponse.json({ error: 'Erreur lors du comptage des listings' }, { status: 500 })
    }

    // Récupérer la souscription active avec les détails du plan
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        status,
        price_id,
        current_period_end,
        pm_type,
        pm_last4,
        pm_brand,
        trial_end,
        current_period_start,
        cancel_at_period_end,
        canceled_at,
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
        subscription: null,
        activeListingsCount: activeListingsCount || 0
      })
    }

    return NextResponse.json({
      hasActiveSubscription: true,
      subscription: subscriptions[0],
      activeListingsCount: activeListingsCount || 0
    })

  } catch (error) {
    console.error('Error in subscription API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 