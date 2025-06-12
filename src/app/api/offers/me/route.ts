import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
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

    // Get the seller ID for the current user from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('seller_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.seller_id) {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      )
    }

    // Get all offers received by the seller
    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select(`
        *,
        seller:sellers!offers_seller_id_fkey (
          id,
          watch_pros_name,
          company_name
        ),
        listing:listings!offers_listing_id_fkey (
          id,
          title,
          price,
          currency,
          status,
          listing_images (
            url,
            order_index
          )
        )
      `)
      .eq('receiver_seller_id', profile.seller_id)
      .order('created_at', { ascending: false })

    if (offersError) {
      console.error('Error fetching offers:', offersError)
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      )
    }

    return NextResponse.json({ offers })
  } catch (err) {
    console.error('Unexpected error in get-my-offers:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 