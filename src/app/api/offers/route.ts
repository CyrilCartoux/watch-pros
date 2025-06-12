import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const CreateOfferSchema = z.object({
  listing_id: z.string().uuid(),
  offer: z.number().positive(),
  currency: z.string().min(3).max(3)
})

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

    // Get all offers for listings owned by the user
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
          ),
          seller:sellers!listings_seller_id_fkey (
            user_id
          )
        )
      `)
      .eq('listing.seller.user_id', user.id)
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
    console.error('Unexpected error in get-offers:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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

    // Get the seller ID for the current user
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const result = CreateOfferSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      )
    }

    const { listing_id, offer, currency } = result.data

    // Check if the listing exists and is active
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, status, seller_id')
      .eq('id', listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Listing is not active' },
        { status: 400 }
      )
    }

    // Vérifier si le vendeur essaie de faire une offre sur sa propre annonce
    if (listing.seller_id === seller.id) {
      return NextResponse.json(
        { error: 'You cannot make an offer on your own listing' },
        { status: 400 }
      )
    }

    // Create the offer
    const { data: newOffer, error: createError } = await supabase
      .from('offers')
      .insert({
        seller_id: seller.id,
        receiver_seller_id: listing.seller_id,
        listing_id,
        offer,
        currency
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating offer:', createError)
      return NextResponse.json(
        { error: 'Failed to create offer' },
        { status: 500 }
      )
    }

    return NextResponse.json({ offer: newOffer })
  } catch (err) {
    console.error('Unexpected error in create-offer:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 