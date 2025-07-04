import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendEmail, emailTemplates } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface SellerReview {
  id: string
  seller_id: string
  reviewer_id: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
  reviewer?: {
    first_name: string
    last_name: string
  }
}

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
        id,
        seller_id,
        reviewer_id,
        rating,
        comment,
        created_at,
        updated_at
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

    // Vérifier que l'utilisateur n'est pas le vendeur
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select('user_id')
      .eq('id', params.id)
      .single()

    if (sellerError) {
      console.error('Error fetching seller:', sellerError)
      return NextResponse.json(
        { error: 'Failed to verify seller' },
        { status: 500 }
      )
    }

    if (seller.user_id === user.id) {
      return NextResponse.json(
        { error: 'You cannot review your own profile' },
        { status: 403 }
      )
    }

    // Récupérer les données de la review
    const body = await request.json()
    const { rating, comment } = body

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
        comment
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

    // Envoi email et notification au vendeur
    try {
      // Récupérer l'email et user_id du vendeur
      const { data: sellerInfo, error: sellerInfoError } = await supabase
        .from('sellers')
        .select('email, user_id, watch_pros_name')
        .eq('id', params.id)
        .single()
        
      const reviewerName = sellerInfo?.watch_pros_name || 'A user'
      if (!sellerInfoError && sellerInfo?.email) {
        await sendEmail({
          to: sellerInfo.email,
          ...emailTemplates.sellerReviewReceived(
            reviewerName,
            rating,
            comment,
            params.id
          )
        })
      }
      // Créer la notification
      if (!sellerInfoError && sellerInfo?.user_id) {
        const { error: notifError } = await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: sellerInfo.user_id,
            type: 'new_review',
            title: 'New Review Received',
            message: `You have received a new review from ${reviewerName}.`
          })
        if (notifError) {
          console.error('Error creating notification:', notifError)
        }
      }
    } catch (err) {
      console.error('Error sending review email/notification:', err)
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

// DELETE /api/sellers/[id]/reviews
export async function DELETE(
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

    // Récupérer l'ID de la review depuis l'URL
    const url = new URL(request.url)
    const reviewId = url.searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Vérifier que la review existe et appartient à l'utilisateur
    const { data: review, error: reviewError } = await supabase
      .from('seller_reviews')
      .select('id')
      .eq('id', reviewId)
      .eq('reviewer_id', user.id)
      .single()

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      )
    }

    // Supprimer la review
    const { error: deleteError } = await supabase
      .from('seller_reviews')
      .delete()
      .eq('id', reviewId)
      .eq('reviewer_id', user.id)

    if (deleteError) {
      console.error('Error deleting review:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 