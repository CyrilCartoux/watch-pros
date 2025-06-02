import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(
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

    // Get the seller associated with the user
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

    // Get the current listing status
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('status')
      .eq('id', params.id)
      .eq('seller_id', seller.id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: 'Listing not found or unauthorized' },
        { status: 404 }
      )
    }

    // Toggle the status
    const newStatus = listing.status === 'active' ? 'paused' : 'active'
    
    const { error: updateError } = await supabase
      .from('listings')
      .update({ status: newStatus })
      .eq('id', params.id)
      .eq('seller_id', seller.id)

    if (updateError) {
      console.error('Error updating listing status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update listing status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ status: newStatus })
  } catch (error) {
    console.error('Error in toggle-status API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 