import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface ListingImage {
  url: string;
  order_index: number;
}

interface Brand {
  slug: string;
  label: string;
}

interface Model {
  slug: string;
  label: string;
}

interface DatabaseListing {
  id: string;
  reference: string;
  title: string;
  description: string;
  year: string;
  condition: string;
  price: number;
  currency: string;
  shipping_delay: string;
  brands: Brand;
  models: Model;
  listing_images: ListingImage[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')

    const supabase = await createClient()

    // Build the query
    let query = supabase
      .from('listings')
      .select(`
        *,
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

    // Add filters
    if (brand) {
      query = query.eq('brands.slug', brand)
    }
    if (model) {
      query = query.eq('models.slug', model)
    }
    if (minPrice) {
      query = query.gte('price', minPrice)
    }
    if (maxPrice) {
      query = query.lte('price', maxPrice)
    }
    if (condition) {
      query = query.eq('condition', condition)
    }

    // Add sorting
    query = query.order(sort, { ascending: order === 'asc' })

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: listings, error, count } = await query

    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json(
        { error: 'Error fetching listings' },
        { status: 500 }
      )
    }

    // Transform the data to match the frontend format
    const transformedListings = (listings as DatabaseListing[]).map(listing => ({
      id: listing.id,
      brand: listing.brands.slug,
      model: listing.models.slug,
      reference: listing.reference,
      title: listing.title,
      description: listing.description,
      year: listing.year,
      condition: listing.condition,
      price: listing.price,
      currency: listing.currency,
      shippingDelay: listing.shipping_delay,
      images: listing.listing_images
        .sort((a, b) => a.order_index - b.order_index)
        .map(img => img.url)
    }))

    return NextResponse.json({
      listings: transformedListings,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error in listings API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 