import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the seller associated with the user
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 })
    }

    // Get reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('seller_reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer_id
      `)
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false })

    if (reviewsError) {
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }

    // Get reviewer information
    const reviewerIds = reviews?.map(review => review.reviewer_id) || []
    const { data: reviewerProfiles, error: reviewerError } = await supabase
      .from('profiles')
      .select(`
        id,
        seller_id,
        sellers (
          watch_pros_name,
          company_logo_url
        )
      `)
      .in('id', reviewerIds)

    if (reviewerError) {
      return NextResponse.json({ error: 'Failed to fetch reviewer profiles' }, { status: 500 })
    }

    // Create a map of reviewers for easy access
    const reviewerMap = new Map(
      reviewerProfiles?.map(profile => [
        profile.id,
        {
          name: (profile.sellers as any)?.watch_pros_name || 'Anonymous',
          avatar: (profile.sellers as any)?.company_logo_url || null
        }
      ]) || []
    )

    // Transform the reviews
    const transformedReviews = reviews?.map(review => {
      const reviewer = reviewerMap.get(review.reviewer_id) || { name: 'Anonymous', avatar: null }
      
      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
        reviewer: {
          id: review.reviewer_id,
          name: reviewer.name,
          avatar: reviewer.avatar
        }
      }
    }) || []

    return NextResponse.json({ reviews: transformedReviews })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 