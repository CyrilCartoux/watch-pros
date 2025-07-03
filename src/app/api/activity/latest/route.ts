import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    // Dernier listing actif
    const { data: listings, error: listingError } = await supabaseAdmin
      .from('listings')
      .select(`
        id,
        reference_id,
        seller_id,
        brand_id,
        model_id,
        reference,
        title,
        description,
        year,
        dial_color,
        condition,
        price,
        currency,
        shipping_delay,
        status,
        created_at,
        listing_type,
        listing_images:listing_images(
          id,
          url,
          order_index
        ),
        seller:sellers(
          id,
          company_name,
          watch_pros_name,
          company_logo_url,
          crypto_friendly
        ),
        models:models(
          slug,
          label
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    if (listingError) {
      return NextResponse.json({ error: 'Failed to fetch latest listing' }, { status: 500 })
    }

    // Dernier vendeur
    const { data: sellers, error: sellerError } = await supabaseAdmin
      .from('sellers')
      .select(`
        id,
        company_name,
        watch_pros_name,
        company_status,
        email,
        country,
        company_logo_url,
        crypto_friendly,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(1)

    if (sellerError) {
      return NextResponse.json({ error: 'Failed to fetch latest seller' }, { status: 500 })
    }

    return NextResponse.json({
      latestListing: listings?.[0] || null,
      latestSeller: sellers?.[0] || null
    })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 