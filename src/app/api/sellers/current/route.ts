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

    // Get the seller_id from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('seller_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.seller_id) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Get the seller data with their address
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select(`
        *,
        seller_addresses (
          street,
          city,
          country,
          postal_code,
          website,
          siren,
          tax_id,
          vat_number
        )
      `)
      .eq('id', profile.seller_id)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json(
        { error: 'Seller data not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(seller)
  } catch (error) {
    console.error('Error fetching seller data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seller data' },
      { status: 500 }
    )
  }
} 