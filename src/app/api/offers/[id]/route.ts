import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const UpdateOfferSchema = z.object({
  action: z.enum(['accept', 'decline'])
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Parse and validate request body
    const body = await request.json()
    const result = UpdateOfferSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      )
    }

    const { action } = result.data

    // Get the offer and verify ownership
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        listing:listings!offers_listing_id_fkey (
          seller_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (offerError || !offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }

    // Verify that the current user owns the listing
    if (offer.listing.seller_id !== profile.seller_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update the offer status
    const { error: updateError } = await supabase
      .from('offers')
      .update({
        is_accepted: action === 'accept'
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('Error updating offer:', updateError)
      return NextResponse.json(
        { error: 'Failed to update offer' },
        { status: 500 }
      )
    }

    // If the offer is accepted, update the listing status to 'sold'
    if (action === 'accept') {
      const { error: listingError } = await supabase
        .from('listings')
        .update({
          status: 'sold',
          final_price: offer.offer
        })
        .eq('id', offer.listing_id)

      if (listingError) {
        console.error('Error updating listing:', listingError)
        return NextResponse.json(
          { error: 'Failed to update listing' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in update-offer:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 