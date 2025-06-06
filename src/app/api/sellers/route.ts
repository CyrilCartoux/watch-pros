import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

interface SellerAddress {
  street: string
  city: string
  country: string
  postal_code: string
  website: string
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
  id_card_front_url: string
  id_card_back_url: string
  proof_of_address_url: string
  title: string
  phone_prefix: string
  phone: string
  created_at: string
  updated_at: string
  seller_addresses: SellerAddress[]
  seller_stats: {
    total_reviews: number
    average_rating: number
    last_updated: string
  } | null
  crypto_friendly: boolean
  identity_verified: boolean
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const order = searchParams.get('order') || 'desc'
    const country = searchParams.get('country')
    const cryptoFriendly = searchParams.get('cryptoFriendly')
    const minRating = searchParams.get('minRating')

    const supabase = await createClient()

    // Start building the query
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
        title,
        phone_prefix,
        phone,
        created_at,
        updated_at,
        crypto_friendly,
        identity_verified,
        seller_addresses (
          street,
          city,
          country,
          postal_code,
          website
        ),
        seller_stats (
          total_reviews,
          average_rating,
          last_updated
        )
      `, { count: 'exact' })
      .eq('identity_verified', true) // Only get verified sellers

    // Apply filters using the new indexes
    if (country) {
      query = query.eq('country', country)
    }
    if (cryptoFriendly === 'true') {
      query = query.eq('crypto_friendly', true)
    }
    if (minRating) {
      query = query.gte('seller_stats.average_rating', parseFloat(minRating))
    }

    // Apply sorting using the new indexes
    query = query.order('seller_stats(average_rating)', { ascending: order === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: sellers, error: sellersError, count } = await query

    if (sellersError) {
      console.error('Error fetching sellers:', sellersError)
      return NextResponse.json(
        { error: 'Failed to fetch sellers' },
        { status: 500 }
      )
    }

    // Transformer les données pour correspondre à la structure attendue
    const transformedSellers = (sellers as any[]).map(seller => ({
      account: {
        companyName: seller.company_name,
        companyLogo: seller.company_logo_url,
        watchProsName: seller.watch_pros_name,
        companyStatus: seller.company_status,
        firstName: seller.first_name,
        lastName: seller.last_name,
        email: seller.email,
        country: seller.country,
        title: seller.title,
        phonePrefix: seller.phone_prefix,
        phone: seller.phone,
        cryptoFriendly: seller.crypto_friendly
      },
      address: seller.seller_addresses?.[0] ? {
        street: seller.seller_addresses[0].street,
        city: seller.seller_addresses[0].city,
        country: seller.seller_addresses[0].country,
        postalCode: seller.seller_addresses[0].postal_code,
        website: seller.seller_addresses[0].website
      } : null,
      stats: seller.seller_stats ? {
        totalReviews: seller.seller_stats.total_reviews || 0,
        averageRating: seller.seller_stats.average_rating || 0,
        lastUpdated: seller.seller_stats.last_updated
      } : {
        totalReviews: 0,
        averageRating: 0,
        lastUpdated: new Date().toISOString()
      }
    }))

    // Calculer le nombre total de pages
    const totalPages = count ? Math.ceil(count / limit) : 0

    return NextResponse.json({
      sellers: transformedSellers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 