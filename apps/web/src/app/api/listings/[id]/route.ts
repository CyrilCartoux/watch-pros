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

interface SellerAddress {
  street: string;
  city: string;
  country: string;
  postal_code: string;
  website: string;
}

interface Seller {
  id: string;
  company_name: string;
  watch_pros_name: string;
  company_status: string;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  title: string;
  phone_prefix: string;
  phone: string;
  created_at: string;
  updated_at: string;
  seller_addresses: SellerAddress[];
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
  gender: string;
  serial_number: string;
  dial_color: string | null;
  diameter_min: number;
  diameter_max: number;
  movement: string | null;
  case_material: string;
  bracelet_material: string;
  bracelet_color: string;
  included: string;
  brands: Brand;
  models: Model;
  listing_images: ListingImage[];
  sellers: Seller;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    const { data: listing, error } = await supabase
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
        ),
        sellers (
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
            website
          )
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching listing:', error)
      return NextResponse.json(
        { error: 'Error fetching listing' },
        { status: 500 }
      )
    }

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the frontend format
    const transformedListing = {
      id: listing.id,
      brand: listing.brands.slug,
      model: listing.models.slug,
      reference: listing.reference,
      title: listing.title,
      description: listing.description,
      year: listing.year,
      gender: listing.gender,
      condition: listing.condition,
      serialNumber: listing.serial_number,
      dialColor: listing.dial_color,
      diameter: {
        min: listing.diameter_min?.toString(),
        max: listing.diameter_max?.toString()
      },
      movement: listing.movement,
      case: listing.case_material,
      braceletMaterial: listing.bracelet_material,
      braceletColor: listing.bracelet_color,
      included: listing.included,
      images: listing.listing_images
        .sort((a: ListingImage, b: ListingImage) => a.order_index - b.order_index)
        .map((img: ListingImage) => img.url),
      price: listing.price,
      currency: listing.currency,
      shippingDelay: listing.shipping_delay,
      seller: listing.sellers ? {
        id: listing.sellers.id,
        name: listing.sellers.company_name || listing.sellers.watch_pros_name,
        logo: '/placeholder-logo.png', // TODO: Add logo field to sellers table
        type: listing.sellers.company_status,
        description: listing.sellers.title,
        location: {
          address: listing.sellers.seller_addresses[0]?.street || '',
          city: listing.sellers.seller_addresses[0]?.city || '',
          postalCode: listing.sellers.seller_addresses[0]?.postal_code || '',
          country: listing.sellers.seller_addresses[0]?.country || listing.sellers.country
        },
        contact: {
          phone: `${listing.sellers.phone_prefix}${listing.sellers.phone}`,
          mobile: `${listing.sellers.phone_prefix}${listing.sellers.phone}`,
          email: listing.sellers.email
        },
        business: {
          vatNumber: '', // TODO: Add VAT number field to sellers table
          hasPhysicalStore: true, // TODO: Add field to sellers table
          yearsOfExperience: 0, // TODO: Add field to sellers table
          specialties: [] // TODO: Add field to sellers table
        },
        stats: {
          totalSales: 0, // TODO: Add field to sellers table
          rating: 5, // TODO: Add field to sellers table
          totalReviews: 0, // TODO: Add field to sellers table
          recommendationRate: 100, // TODO: Add field to sellers table
          ratings: {
            shipping: 5, // TODO: Add field to sellers table
            description: 5, // TODO: Add field to sellers table
            communication: 5 // TODO: Add field to sellers table
          }
        },
        certifications: [] // TODO: Add certifications table
      } : null
    }

    return NextResponse.json(transformedListing)
  } catch (error) {
    console.error('Error in listing API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 