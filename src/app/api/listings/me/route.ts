import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface Brand {
  slug: string;
  label: string;
}

interface Model {
  slug: string;
  label: string;
}

interface ListingImage {
  url: string;
  order_index: number;
}

interface DatabaseListing {
  id: string;
  title: string;
  price: number;
  status: string;
  listing_type: string;
  created_at: string;
  updated_at: string;
  brands: Brand;
  models: Model;
  listing_images: ListingImage[];
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
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

    // Pagination params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const status = searchParams.get('status') || 'active'
    const offset = (page - 1) * limit

    // Validate status
    if (!['active', 'sold', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Get all listings for this seller (paginated)
    const { data: listings, error: listingsError, count } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        status,
        listing_type,
        created_at,
        updated_at,
        sold_at,
        final_price,
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
      `, { count: 'exact' })
      .eq('seller_id', seller.id)
      .eq('status', status)
      .order(status === 'sold' ? 'sold_at' : 'created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (listingsError) {
      console.error('Error fetching listings:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch listings' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend format
    const transformedListings = (listings as any[]).map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      status: listing.status,
      type: listing.listing_type,
      brand: listing.brands.label,
      model: listing.models.label,
      image: listing.listing_images?.[0]?.url || null,
      createdAt: listing.created_at,
      updatedAt: listing.updated_at,
      soldAt: listing.sold_at,
      finalPrice: listing.final_price
    }))

    return NextResponse.json({
      listings: transformedListings,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error in listings/me API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 