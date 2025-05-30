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
  username: string
  country: string
  title: string
  phone_prefix: string
  phone: string
  language: string
  created_at: string
  updated_at: string
  seller_addresses: SellerAddress[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const supabase = await createClient()

    // Récupérer les vendeurs avec pagination
    const { data: sellers, error: sellersError, count } = await supabase
      .from('sellers')
      .select(`
        id,
        company_name,
        watch_pros_name,
        company_status,
        first_name,
        last_name,
        email,
        username,
        country,
        title,
        phone_prefix,
        phone,
        language,
        created_at,
        updated_at,
        seller_addresses (
          street,
          city,
          country,
          postal_code,
          website
        )
      `, { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (sellersError) {
      console.error('Error fetching sellers:', sellersError)
      return NextResponse.json(
        { error: 'Failed to fetch sellers' },
        { status: 500 }
      )
    }

    // Transformer les données pour correspondre à la structure attendue
    const transformedSellers = (sellers as Seller[]).map(seller => ({
      account: {
        companyName: seller.company_name,
        watchProsName: seller.watch_pros_name,
        companyStatus: seller.company_status,
        firstName: seller.first_name,
        lastName: seller.last_name,
        email: seller.email,
        username: seller.username,
        country: seller.country,
        title: seller.title,
        phonePrefix: seller.phone_prefix,
        phone: seller.phone,
        language: seller.language
      },
      address: seller.seller_addresses?.[0] ? {
        street: seller.seller_addresses[0].street,
        city: seller.seller_addresses[0].city,
        country: seller.seller_addresses[0].country,
        postalCode: seller.seller_addresses[0].postal_code,
        website: seller.seller_addresses[0].website
      } : null
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