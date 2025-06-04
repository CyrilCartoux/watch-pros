import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const Schema = z.object({
  listing_id: z.string().uuid('Invalid listing ID'),
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

    // Get user's listing subscriptions with listing details
    const { data: subscriptions, error: subError } = await supabase
      .from('listing_subscriptions')
      .select(`
        id,
        created_at,
        listing:listings (
          id,
          title,
          price,
          currency,
          status,
          brand:brands (
            id,
            slug,
            label
          ),
          model:models (
            id,
            slug,
            label
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (subError) {
      console.error('Error fetching subscriptions:', subError)
      return NextResponse.json(
        { error: 'Failed to fetch subscriptions' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriptions })
  } catch (err) {
    console.error('Unexpected error in get-subscriptions:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const parse = Schema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { listing_id } = parse.data
    
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 3. Verify listing exists and is active
    const { data: listing, error: listingErr } = await supabaseAdmin
      .from('listings')
      .select('id, status')
      .eq('id', listing_id)
      .single()

    if (listingErr || !listing) {
      console.log('Listing not found')
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Cannot subscribe to inactive listing' },
        { status: 400 }
      )
    }

    // 4. Create subscription
    const { error: subErr } = await supabaseAdmin
      .from('listing_subscriptions')
      .upsert({
        user_id: user.id,
        listing_id,
      })

    if (subErr) {
      console.error('Error creating listing subscription:', subErr)
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in subscribe-listing:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json()
    const parse = Schema.safeParse(body)
    if (!parse.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parse.error.format() },
        { status: 400 }
      )
    }
    const { listing_id } = parse.data
    
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Delete subscription
    const { error: deleteErr } = await supabaseAdmin
      .from('listing_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('listing_id', listing_id)

    if (deleteErr) {
      console.error('Error deleting listing subscription:', deleteErr)
      return NextResponse.json(
        { error: 'Failed to delete subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Unexpected error in delete-subscription:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
