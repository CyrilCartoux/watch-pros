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
  profiles?: {
    seller_id: string | null
    sellers: {
      watch_pros_name: string
    } | null
  } | null
}

interface Seller {
  id: string
  company_name: string
  company_logo_url: string
  watch_pros_name: string
  company_status: string
  first_name: string
  last_name: string
  email: string
  country: string
  phone_prefix: string
  phone: string
  created_at: string
  updated_at: string
  seller_addresses: SellerAddress[]
  seller_banking: SellerBanking[]
  seller_stats: {
    total_reviews: number
    average_rating: number
    last_updated: string
  } | null
  crypto_friendly: boolean
}

interface Listing {
  id: string
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

// Types pour la mise à jour
interface SellerUpdateRequest {
  account?: {
    companyName?: string
    companyLogo?: string | null
    watchProsName?: string
    companyStatus?: string
    firstName?: string
    lastName?: string
    email?: string
    country?: string
    phonePrefix?: string
    phone?: string
    cryptoFriendly?: boolean
  }
  address?: {
    street?: string
    city?: string
    country?: string
    postalCode?: string
    website?: string
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Check if the id is a UUID (seller id) or a string (watch_pros_name)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id)

    // Build the query based on the id type
    let query = supabase
      .from('sellers')
      .select(`
        id,
        company_name,
        company_logo_url,
        watch_pros_name,
        company_status,
        first_name,
        last_name,
        email,
        country,
        phone_prefix,
        phone,
        created_at,
        updated_at,
        crypto_friendly,
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
        seller_stats (
          total_reviews,
          average_rating,
          last_updated
        )
      `)

    // Apply the appropriate filter
    if (isUUID) {
      query = query.eq('id', params.id)
    } else {
      query = query.eq('watch_pros_name', params.id)
    }

    const { data: seller, error: sellerError } = await query.maybeSingle()

    if (sellerError) {
      console.error('Error fetching seller:', sellerError)
      if (sellerError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Seller not found' },
          { status: 404 }
        )
      }
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

    // Récupérer les listings du vendeur
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select(`
        id,
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
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (listingsError) {
      console.error('Error fetching listings:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    // Transformer les listings pour correspondre à la structure attendue
    const transformedListings = listings?.map(listing => ({
      id: listing.id,
      brand: (listing.brands as any)?.label || '',
      model: (listing.models as any)?.label || '',
      reference: listing.reference,
      price: listing.price,
      currency: listing.currency,
      image: listing.listing_images?.[0]?.url || ''
    })) || []

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
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError)
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      )
    }

    // Récupérer les informations des reviewers
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
      console.error('Error fetching reviewer profiles:', reviewerError)
      return NextResponse.json(
        { error: 'Failed to fetch reviewer profiles' },
        { status: 500 }
      )
    }

    // Créer un map des reviewers pour un accès facile
    const reviewerMap = new Map(
      reviewerProfiles?.map(profile => [
        profile.id,
        (profile.sellers as any).watch_pros_name || 'Anonymous'
      ]) || []
    )

    // Transformer les données pour correspondre à la structure attendue
    const transformedSeller = {
      id: seller.id,
      account: {
        companyName: seller.company_name,
        companyLogo: seller.company_logo_url,
        watchProsName: seller.watch_pros_name,
        companyStatus: seller.company_status,
        firstName: seller.first_name,
        lastName: seller.last_name,
        email: seller.email,
        country: seller.country,
        phonePrefix: seller.phone_prefix,
        phone: seller.phone,
        cryptoFriendly: seller.crypto_friendly
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
      reviews: reviews?.map(review => ({
        id: review.id,
        rating: review.rating,
        reviewerId: review.reviewer_id,
        reviewerName: reviewerMap.get(review.reviewer_id) || 'Anonymous',
        reviewerCompanyLogo: (reviewerProfiles?.find(p => p.id === review.reviewer_id)?.sellers as any)?.company_logo_url || null,
        comment: review.comment,
        createdAt: review.created_at,
      })) || [],
      stats: {
        totalReviews: (seller.seller_stats as any)?.total_reviews || 0,
        averageRating: (seller.seller_stats as any)?.average_rating || 0,
        lastUpdated: (seller.seller_stats as any)?.last_updated || new Date().toISOString()
      },
      listings: transformedListings
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Vérifier que l'utilisateur est authentifié
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Vérifier que l'utilisateur est le propriétaire du profil vendeur
    const { data: profile } = await supabase
      .from('profiles')
      .select('seller_id')
      .eq('id', user.id)
      .single()

    if (!profile || profile.seller_id !== params.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Récupérer les données de mise à jour
    const updateData: SellerUpdateRequest = await request.json()

    // Préparer les mises à jour pour la table sellers
    const sellerUpdates: any = {}
    if (updateData.account) {
      if (updateData.account.companyName) sellerUpdates.company_name = updateData.account.companyName
      if (updateData.account.companyLogo !== undefined) sellerUpdates.company_logo_url = updateData.account.companyLogo
      if (updateData.account.watchProsName) sellerUpdates.watch_pros_name = updateData.account.watchProsName
      if (updateData.account.companyStatus) sellerUpdates.company_status = updateData.account.companyStatus
      if (updateData.account.firstName) sellerUpdates.first_name = updateData.account.firstName
      if (updateData.account.lastName) sellerUpdates.last_name = updateData.account.lastName
      if (updateData.account.email) sellerUpdates.email = updateData.account.email
      if (updateData.account.country) sellerUpdates.country = updateData.account.country
      if (updateData.account.phonePrefix) sellerUpdates.phone_prefix = updateData.account.phonePrefix
      if (updateData.account.phone) sellerUpdates.phone = updateData.account.phone
      if (updateData.account.cryptoFriendly !== undefined) sellerUpdates.crypto_friendly = updateData.account.cryptoFriendly
    }

    // Mettre à jour la table sellers
    const { error: sellerError } = await supabase
      .from('sellers')
      .update(sellerUpdates)
      .eq('id', params.id)

    if (sellerError) {
      console.error('Error updating seller:', sellerError)
      return NextResponse.json(
        { error: 'Failed to update seller' },
        { status: 500 }
      )
    }

    // Mettre à jour l'adresse si fournie
    if (updateData.address) {
      const addressUpdates: any = {}
      if (updateData.address.street) addressUpdates.street = updateData.address.street
      if (updateData.address.city) addressUpdates.city = updateData.address.city
      if (updateData.address.country) addressUpdates.country = updateData.address.country
      if (updateData.address.postalCode) addressUpdates.postal_code = updateData.address.postalCode
      if (updateData.address.website) addressUpdates.website = updateData.address.website

      // Vérifier si une adresse existe déjà
      const { data: existingAddress } = await supabase
        .from('seller_addresses')
        .select('id')
        .eq('seller_id', params.id)
        .single()

      if (existingAddress) {
        // Mettre à jour l'adresse existante
        const { error: addressError } = await supabase
          .from('seller_addresses')
          .update(addressUpdates)
          .eq('id', existingAddress.id)

        if (addressError) {
          console.error('Error updating address:', addressError)
          return NextResponse.json(
            { error: 'Failed to update address' },
            { status: 500 }
          )
        }
      } else {
        // Créer une nouvelle adresse
        const { error: addressError } = await supabase
          .from('seller_addresses')
          .insert({
            seller_id: params.id,
            ...addressUpdates
          })

        if (addressError) {
          console.error('Error creating address:', addressError)
          return NextResponse.json(
            { error: 'Failed to create address' },
            { status: 500 }
          )
        }
      }
    }

    // Récupérer les données mises à jour
    const { data: updatedSeller, error: fetchError } = await supabase
      .from('sellers')
      .select(`
        id,
        company_name,
        company_logo_url,
        watch_pros_name,
        company_status,
        first_name,
        last_name,
        email,
        country,
        phone_prefix,
        phone,
        created_at,
        updated_at,
        crypto_friendly,
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
      .eq('id', params.id)
      .single()

    if (fetchError) {
      console.error('Error fetching updated seller:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch updated seller' },
        { status: 500 }
      )
    }

    // Transformer les données pour correspondre à la structure attendue
    const transformedSeller = {
      id: updatedSeller.id,
      account: {
        companyName: updatedSeller.company_name,
        companyLogo: updatedSeller.company_logo_url,
        watchProsName: updatedSeller.watch_pros_name,
        companyStatus: updatedSeller.company_status,
        firstName: updatedSeller.first_name,
        lastName: updatedSeller.last_name,
        email: updatedSeller.email,
        country: updatedSeller.country,
        phonePrefix: updatedSeller.phone_prefix,
        phone: updatedSeller.phone,
        cryptoFriendly: updatedSeller.crypto_friendly
      },
      address: updatedSeller.seller_addresses?.[0] ? {
        street: updatedSeller.seller_addresses[0].street,
        city: updatedSeller.seller_addresses[0].city,
        country: updatedSeller.seller_addresses[0].country,
        postalCode: updatedSeller.seller_addresses[0].postal_code,
        website: updatedSeller.seller_addresses[0].website,
        siren: updatedSeller.seller_addresses[0].siren,
        taxId: updatedSeller.seller_addresses[0].tax_id,
        vatNumber: updatedSeller.seller_addresses[0].vat_number
      } : null
    }

    return NextResponse.json(transformedSeller)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 