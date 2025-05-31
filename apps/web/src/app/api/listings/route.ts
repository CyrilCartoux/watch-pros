import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

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

// Constants for image optimization
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 80
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function optimizeImage(file: File): Promise<Buffer> {
  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // Optimize image
  return sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .jpeg({ quality: QUALITY, progressive: true })
    .toBuffer()
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
    console.log(formData)

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log('Current user:', user)
    console.log('User error:', userError)
    
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

    console.log('Seller data:', seller)
    console.log('Seller error:', sellerError)
    
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
      console.log('Model error:', modelError)
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Generate a unique reference_id
    const reference_id = `${brand}-${model}-${reference}-${Date.now()}`

    // Log the data we're trying to insert
    const listingData = {
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
    }

    // Create the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single()

    if (listingError) {
      console.error('Error creating listing:', listingError)
      console.error('Full error details:', JSON.stringify(listingError, null, 2))
      return NextResponse.json(
        { error: 'Failed to create listing', details: listingError },
        { status: 500 }
      )
    }

    // Handle image uploads
    const images = formData.getAll('images') as File[]
    if (images.length > 0) {
      const imageUploadPromises = images.map(async (image, index) => {
        try {
          // Validate image type
          if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
            throw new Error(`Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
          }

          // Optimize image
          const optimizedBuffer = await optimizeImage(image)

          // Create a unique file name with extension
          const fileExt = 'jpg' // We always convert to jpg for consistency
          const imageFileName = `${listing.id}/${model}-${reference}-${index + 1}.${fileExt}`

          // Upload optimized image to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listingimages')
            .upload(imageFileName, optimizedBuffer, {
              contentType: 'image/jpeg',
              upsert: false,
              cacheControl: '3600'
            })

          if (uploadError) {
            console.error(`Error uploading image ${index}:`, uploadError)
            throw new Error(`Failed to upload image ${index}: ${uploadError.message}`)
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('listingimages')
            .getPublicUrl(imageFileName)

          return supabase
            .from('listing_images')
            .insert({
              listing_id: listing.id,
              url: publicUrl,
              order_index: index
            })
        } catch (error) {
          console.error(`Error processing image ${index}:`, error)
          // If there's an error, try to clean up any uploaded files
          try {
            await supabase.storage
              .from('listingimages')
              .remove([`${listing.id}/${model}-${reference}-${index + 1}.jpg`])
          } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError)
          }
          throw error
        }
      })

      await Promise.all(imageUploadPromises)
    }

    // Handle document uploads
    const documents = formData.getAll('documents') as File[]
    if (documents.length > 0) {
      const documentUploadPromises = documents.map(async (document) => {
        try {
          // Convert File to ArrayBuffer
          const arrayBuffer = await document.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Create a unique file name with extension
          const fileExtension = document.name.split('.').pop()
          const fileName = `${listing.id}/documents/${document.name}`

          // Upload file to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listingdocuments')
            .upload(fileName, buffer, {
              contentType: document.type,
              upsert: false,
              cacheControl: '3600'
            })

          if (uploadError) {
            console.error(`Error uploading document:`, uploadError)
            throw new Error(`Failed to upload document: ${uploadError.message}`)
          }

          // Get the public URL
          const { data: { publicUrl } } = supabase.storage
            .from('listingdocuments')
            .getPublicUrl(fileName)

          return supabase
            .from('listing_documents')
            .insert({
              listing_id: listing.id,
              document_type: fileExtension?.toUpperCase() || 'OTHER',
              url: publicUrl
            })
        } catch (error) {
          console.error(`Error processing document:`, error)
          // If there's an error, try to clean up any uploaded files
          try {
            await supabase.storage
              .from('listingdocuments')
              .remove([`${listing.id}/documents/${document.name}`])
          } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError)
          }
          throw error
        }
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