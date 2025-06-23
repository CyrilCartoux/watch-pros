import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Brand {
  slug: string;
  label: string;
}

interface Model {
  slug: string;
  label: string;
}


// Constants for image optimization
const MAX_WIDTH = 1200
const MAX_HEIGHT = 1200
const QUALITY = 80
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/heic', 'image/heif']

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
    const query = searchParams.get('query') || ''
    
    // Filter parameters (only the ones that are still used)
    const condition = searchParams.get('condition')
    const dialColor = searchParams.get('dialColor')
    const country = searchParams.get('country')
    const included = searchParams.get('included')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const shippingDelay = searchParams.get('shippingDelay')
    const listingType = searchParams.get('listingType')

    const supabase = await createClient()

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Call the RPC function with simplified parameters
    const { data: listings, error } = await supabase
      .rpc('rpc_search_listings', {
        _search: query || null,
        _brand_slug: null,  // No longer used
        _model_slug: null,  // No longer used
        _ref: null,         // No longer used
        _cond: condition || null,
        _dial_color: dialColor || null,
        _country: country || null,
        _year: null,        // No longer used
        _included: included || null,
        _min_price: minPrice ? parseFloat(minPrice) : null,
        _max_price: maxPrice ? parseFloat(maxPrice) : null,
        _shipping: shippingDelay || null,
        _listing_type: listingType || null,
        _limit: limit + offset // Get more results to handle pagination
      })

    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
    }

    // Apply pagination manually since RPC doesn't support OFFSET
    const paginatedListings = listings ? listings.slice(offset, offset + limit) : []

    // Récupère full_count (filtré) et total (global) depuis le résultat du RPC
    const fullCount = paginatedListings.length > 0 ? Number(paginatedListings[0].full_count) : 0
    const total = paginatedListings.length > 0 && paginatedListings[0].total !== undefined
      ? Number(paginatedListings[0].total)
      : 0

    return NextResponse.json({
      listings: paginatedListings,
      total,      // total global (tous les listings)
      fullCount,  // total filtré (après recherche/filtres)
      page,
      limit,
      totalPages: Math.ceil(fullCount / limit)
    })
  } catch (error) {
    console.error('Error in listings API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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
      .select('id, country')
      .eq('user_id', user.id)
      .single()

    if (sellerError || !seller) {
      return NextResponse.json(
        { error: 'Seller account not found' },
        { status: 404 }
      )
    }

    // Extract form fields
    const accessoryType = formData.get('accessory_type') as string
    const brand = formData.get('brand') as string
    const model = formData.get('model') as string
    const reference = formData.get('reference') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const year = formData.get('year') as string
    const dialColor = formData.get('dialColor') as string
    const included = formData.get('included') as string
    const condition = formData.get('condition') as string
    const price = parseFloat(formData.get('price') as string)
    const currency = formData.get('currency') as string || 'EUR'
    const shippingDelay = formData.get('shippingDelay') as string
    const listingType = formData.get('listing_type') as string
    const country = seller.country

    // Get brand and model IDs
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .or(`id.eq.${brand},slug.eq.${brand}`)
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
      .or(`id.eq.${model},slug.eq.${model}`)
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

    const listingData = {
      accessory_type: accessoryType,
      reference_id,
      seller_id: seller.id,
      brand_id: brandData.id,
      model_id: modelData.id,
      reference,
      title,
      description: description || null,
      year: year || null,
      dial_color: dialColor || null,
      included,
      condition,
      price,
      currency,
      shipping_delay: shippingDelay,
      listing_type: listingType,
      status: 'active',
      country: country || null
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
      if (listingError.message.includes('Quota exceeded')) {
        return NextResponse.json(
          { error: 'Listing quota exceeded for this subscription' },
          { status: 400 }
        )
      }
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
          const imageFileName = `${listing.id}/${model}-${reference}-${listingType}-${index + 1}.${fileExt}`

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

          // Insert into listing_images table
          const { data: imageData, error: imageError } = await supabase
            .from('listing_images')
            .insert({
              listing_id: listing.id,
              url: publicUrl,
              order_index: index
            })
            .select()
            .single()

          if (imageError) {
            console.error(`Error inserting image record ${index}:`, imageError)
            // Clean up the uploaded file if database insert fails
            await supabase.storage
              .from('listingimages')
              .remove([imageFileName])
            throw new Error(`Failed to create image record ${index}: ${imageError.message}`)
          }

          return imageData
        } catch (error) {
          console.error(`Error processing image ${index}:`, error)
          // If there's an error, try to clean up any uploaded files
          try {
            await supabase.storage
              .from('listingimages')
              .remove([`${listing.id}/${model}-${reference}-${listingType}-${index + 1}.jpg`])
          } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError)
          }
          throw error
        }
      })

      try {
        await Promise.all(imageUploadPromises)
      } catch (error) {
        console.error('Error uploading images:', error)
        // If any image upload fails, delete the listing and all uploaded images
        try {
          // Delete all images from storage
          const imageFiles = images.map((_, index) => 
            `${listing.id}/${model}-${reference}-${listingType}-${index + 1}.jpg`
          )
          await supabase.storage
            .from('listingimages')
            .remove(imageFiles)

          // Delete the listing
          await supabase
            .from('listings')
            .delete()
            .eq('id', listing.id)

          throw new Error('Failed to upload images: ' + (error as Error).message)
        } catch (cleanupError) {
          console.error('Error cleaning up after failed upload:', cleanupError)
          throw new Error('Failed to upload images and cleanup failed')
        }
      }
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