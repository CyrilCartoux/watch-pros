import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

// Add cache configuration
export const runtime = 'edge'
export const preferredRegion = 'auto'

// Add cache headers
const CACHE_TTL = 60 // 60 seconds
const CACHE_STALE_WHILE_REVALIDATE = 300 // 5 minutes

interface SellerAddress {
  street: string
  city: string
  country: string
  postal_code: string
  website: string
  siren: string
  tax_id: string
  vat_number: string
}

interface SellerBanking {
  card_holder: string
  bank_name: string
  payment_method: string
}

interface SellerReview {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer_id: string
  reviewer: {
    first_name: string
    last_name: string
  } | null
}

interface Seller {
  id: string
  company_name: string
  watch_pros_name: string
  company_status: string
  first_name: string
  last_name: string
  email: string
  country: string
  title: string
  phone_prefix: string
  phone: string
  created_at: string
  updated_at: string
  seller_addresses: SellerAddress[]
  seller_banking: SellerBanking[]
  seller_stats: {
    total_reviews: number
    average_rating: number
    total_approvals: number
    last_updated: string
  } | null
}

interface Listing {
  id: string
  title: string
  price: number
  currency: string
  reference: string
  brands: {
    slug: string
    label: string
  }[]
  models: {
    slug: string
    label: string
  }[]
  listing_images: {
    url: string
    order_index: number
  }[]
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Récupérer le vendeur avec ses relations
    const { data: seller, error: sellerError } = await supabase
      .from('sellers')
      .select(`
        id,
        company_name,
        watch_pros_name,
        company_status,
        first_name,
        last_name,
        email,
        country,
        title,
        phone_prefix,
        phone,
        created_at,
        updated_at,
        seller_addresses (
          street,
          city,
          country,
          postal_code,
          website,
          siren,
          tax_id,
          vat_number
        ),
        seller_banking (
          card_holder,
          bank_name,
          payment_method
        )
      `)
      .eq('watch_pros_name', params.id)
      .single()

    if (sellerError) {
      console.error('Error fetching seller:', sellerError)
      return NextResponse.json(
        { error: 'Failed to fetch seller' },
        { status: 500 }
      )
    }

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Récupérer les stats séparément
    const { data: stats } = await supabase
      .from('seller_stats')
      .select('*')
      .eq('seller_id', seller.id)
      .single()

    // Récupérer les reviews
    const { data: reviews, error: reviewsError } = await supabase
      .from('seller_reviews')
      .select(`
        id,
        rating,
        reviewer_id,
        comment,
        created_at
      `)
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false }) as { data: SellerReview[] | null, error: any }

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Récupérer l'utilisateur actuel
    const { data: { user } } = await supabase.auth.getUser()

    // Vérifier si l'utilisateur a approuvé ce vendeur
    let isApproved = false
    if (user) {
      const { data: approval } = await supabase
        .from('seller_approvals')
        .select('id')
        .eq('seller_id', seller.id)
        .eq('approver_id', user.id)
        .single()

      isApproved = !!approval
    }

    // Requête principale pour les annonces actives
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        currency,
        reference,
        brands (
          slug,
          label
        ),
        models (
          slug,
          label
        ),
        listing_images (
          url,
          order_index
        )
      `)
      .eq('seller_id', seller.id)
      .order('created_at', { ascending: false })
      .limit(6)

    if (listingsError) {
      console.error('Error fetching listings:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }
    
    // Transformer les données pour correspondre à la structure attendue
    const transformedSeller = {
      id: seller.id,
      account: {
        companyName: seller.company_name,
        watchProsName: seller.watch_pros_name,
        companyStatus: seller.company_status,
        firstName: seller.first_name,
        lastName: seller.last_name,
        email: seller.email,
        country: seller.country,
        title: seller.title,
        phonePrefix: seller.phone_prefix,
        phone: seller.phone
      },
      address: seller.seller_addresses?.[0] ? {
        street: seller.seller_addresses[0].street,
        city: seller.seller_addresses[0].city,
        country: seller.seller_addresses[0].country,
        postalCode: seller.seller_addresses[0].postal_code,
        website: seller.seller_addresses[0].website,
        siren: seller.seller_addresses[0].siren,
        taxId: seller.seller_addresses[0].tax_id,
        vatNumber: seller.seller_addresses[0].vat_number
      } : null,
      banking: seller.seller_banking?.[0] ? {
        cardHolder: seller.seller_banking[0].card_holder,
        bankName: seller.seller_banking[0].bank_name,
        paymentMethod: seller.seller_banking[0].payment_method
      } : null,
      listings: listings?.map(listing => {
        return {
          id: listing.id,
          brand: listing.brands?.[0]?.label || '',
          model: listing.models?.[0]?.label || '',
          reference: listing.reference,
          price: listing.price,
          currency: listing.currency,
          image: listing.listing_images?.[0]?.url || '/images/placeholder.jpg'
        }
      }) || [],
      isApproved,
      stats: stats ? {
        totalReviews: stats.total_reviews || 0,
        averageRating: stats.average_rating || 0,
        totalApprovals: stats.total_approvals || 0,
        lastUpdated: stats.last_updated
      } : {
        totalReviews: 0,
        averageRating: 0,
        totalApprovals: 0,
        lastUpdated: new Date().toISOString()
      },
      reviews: reviews?.map(review => ({
        id: review.id,
        rating: review.rating,
        reviewerId: review.reviewer_id,
        comment: review.comment,
        createdAt: review.created_at,
      })) || []
    }

    // Add cache control headers
    const response = NextResponse.json(
      transformedSeller,
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        },
      }
    )

    return response
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 