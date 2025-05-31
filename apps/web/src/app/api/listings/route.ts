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

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()

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
        { error: 'Seller account not found' },
        { status: 404 }
      )
    }

    // Extract form fields
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const reference = formData.get('reference') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const year = formData.get('year') as string
    const gender = formData.get('gender') as string
    const serialNumber = formData.get('serialNumber') as string
    const dialColor = formData.get('dialColor') as string
    const diameterMin = formData.get('diameter.min') as string
    const diameterMax = formData.get('diameter.max') as string
    const movement = formData.get('movement') as string
    const caseMaterial = formData.get('case') as string
    const braceletMaterial = formData.get('braceletMaterial') as string
    const braceletColor = formData.get('braceletColor') as string
    const included = formData.get('included') as string
    const condition = formData.get('condition') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string || 'EUR'
    const shippingDelay = formData.get('shippingDelay') as string

    // Get brand and model IDs
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', brand)
      .single()

    if (brandError || !brandData) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    const { data: modelData, error: modelError } = await supabase
      .from('models')
      .select('id')
      .eq('slug', model)
      .eq('brand_id', brandData.id)
      .single()

    if (modelError || !modelData) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Generate a unique reference_id
    const reference_id = `${brand}-${model}-${reference}-${Date.now()}`

    // Create the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        reference_id,
        seller_id: seller.id,
        brand_id: brandData.id,
        model_id: modelData.id,
        reference,
        title,
        description: description || null,
        year: year || null,
        gender: gender || null,
        serial_number: serialNumber || null,
        dial_color: dialColor || null,
        diameter_min: diameterMin ? parseInt(diameterMin) : null,
        diameter_max: diameterMax ? parseInt(diameterMax) : null,
        movement: movement || null,
        case_material: caseMaterial || null,
        bracelet_material: braceletMaterial || null,
        bracelet_color: braceletColor || null,
        included,
        condition,
        price,
        currency,
        shipping_delay: shippingDelay,
        status: 'draft'
      })
      .select()
      .single()

    if (listingError) {
      console.error('Error creating listing:', listingError)
      return NextResponse.json(
        { error: 'Failed to create listing' },
        { status: 500 }
      )
    }

    // Handle image uploads
    const images = formData.getAll('images') as File[]
    if (images.length > 0) {
      const imageUploadPromises = images.map(async (image, index) => {
        const fileExt = image.name.split('.').pop()
        const imageFileName = `${listing.id}/${Date.now()}-${index}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(imageFileName, image)

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrl } = supabase.storage
          .from('listings')
          .getPublicUrl(imageFileName)

        return supabase
          .from('listing_images')
          .insert({
            listing_id: listing.id,
            url: publicUrl.publicUrl,
            order_index: index
          })
      })

      await Promise.all(imageUploadPromises)
    }

    // Handle document uploads
    const documents = formData.getAll('documents') as File[]
    if (documents.length > 0) {
      const documentUploadPromises = documents.map(async (document) => {
        const fileExt = document.name.split('.').pop()
        const docFileName = `${listing.id}/documents/${Date.now()}-${document.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('listings')
          .upload(docFileName, document)

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrl } = supabase.storage
          .from('listings')
          .getPublicUrl(docFileName)

        return supabase
          .from('listing_documents')
          .insert({
            listing_id: listing.id,
            document_type: fileExt?.toUpperCase() || 'OTHER',
            url: publicUrl.publicUrl
          })
      })

      await Promise.all(documentUploadPromises)
    }

    return NextResponse.json({ success: true, listing })
  } catch (error) {
    console.error('Error in POST /api/listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 