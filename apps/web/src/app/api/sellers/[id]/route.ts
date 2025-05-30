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
  siren: string
  tax_id: string
  vat_number: string
}

interface SellerBanking {
  card_holder: string
  bank_name: string
  payment_method: string
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
  seller_banking: SellerBanking[]
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
      .eq('username', params.id)
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

    // Transformer les données pour correspondre à la structure attendue
    const transformedSeller = {
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
        website: seller.seller_addresses[0].website,
        siren: seller.seller_addresses[0].siren,
        taxId: seller.seller_addresses[0].tax_id,
        vatNumber: seller.seller_addresses[0].vat_number
      } : null,
      banking: seller.seller_banking?.[0] ? {
        cardHolder: seller.seller_banking[0].card_holder,
        bankName: seller.seller_banking[0].bank_name,
        paymentMethod: seller.seller_banking[0].payment_method
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