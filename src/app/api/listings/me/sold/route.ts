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
  final_price: number;
  status: string;
  listing_type: string;
  created_at: string;
  updated_at: string;
  sold_at: string;
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
    const offset = (page - 1) * limit

    // Get total sum of sold watches
    const { data: totalSum, error: sumError } = await supabase
      .from('listings')
      .select('final_price')
      .eq('seller_id', seller.id)
      .eq('status', 'sold')
      .not('final_price', 'is', null)

    if (sumError) {
      console.error('Error fetching total sum:', sumError)
      return NextResponse.json(
        { error: 'Failed to fetch total sum' },
        { status: 500 }
      )
    }

    const totalAmount = totalSum.reduce((sum, listing) => sum + (listing.final_price || 0), 0)

    // Get all sold listings for this seller (paginated)
    const { data: listings, error: listingsError, count } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        price,
        final_price,
        status,
        listing_type,
        created_at,
        updated_at,
        sold_at,
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
      .eq('status', 'sold')
      .order('sold_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (listingsError) {
      console.error('Error fetching sold listings:', listingsError)
      return NextResponse.json(
        { error: 'Failed to fetch sold listings' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend format
    const transformedListings = (listings as any[]).map(listing => ({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      finalPrice: listing.final_price,
      status: listing.status,
      type: listing.listing_type,
      brand: listing.brands.label,
      model: listing.models.label,
      image: listing.listing_images?.[0]?.url || null,
      createdAt: listing.created_at,
      updatedAt: listing.updated_at,
      soldAt: listing.sold_at
    }))

    return NextResponse.json({
      listings: transformedListings,
      total: count || 0,
      totalAmount,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error in listings/me/sold API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 