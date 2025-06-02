import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET /api/sellers/[id]/reviews
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Récupérer les reviews du vendeur
    const { data: reviews, error: reviewsError } = await supabase
      .from('seller_reviews')
      .select(`
        *,
        reviewer:reviewer_id (
          first_name,
          last_name
        )
      `)
      .eq('seller_id', params.id)
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/sellers/[id]/reviews
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Récupérer les données de la review
    const body = await request.json()
    const { rating, comment, listingId } = body

    // Valider les données
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur a déjà laissé une review
    const { data: existingReview } = await supabase
      .from('seller_reviews')
      .select('id')
      .eq('seller_id', params.id)
      .eq('reviewer_id', user.id)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this seller' },
        { status: 400 }
      )
    }

    // Créer la review
    const { data: review, error: reviewError } = await supabase
      .from('seller_reviews')
      .insert({
        seller_id: params.id,
        reviewer_id: user.id,
        rating,
        comment,
        listing_id: listingId,
        is_verified: false // À implémenter : vérification si l'utilisateur a fait un achat
      })
      .select()
      .single()

    if (reviewError) {
      console.error('Error creating review:', reviewError)
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      )
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 