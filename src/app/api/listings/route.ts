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
    const search = searchParams.get('search') || ''
    const after = searchParams.get('after') // Cursor for pagination
    
    // Filter parameters
    const brand = searchParams.get('brand') || searchParams.get('brand_id')
    const model = searchParams.get('model') || searchParams.get('model_id')
    const reference = searchParams.get('reference')
    const seller = searchParams.get('seller')
    const year = searchParams.get('year')
    const dialColor = searchParams.get('dialColor')
    const condition = searchParams.get('condition')
    const included = searchParams.get('included')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const shippingDelay = searchParams.get('shippingDelay')
    const listingType = searchParams.get('listingType')

    const supabase = await createClient()

    // Start building the query
    let query = supabase
      .from('listings')
      .select(`
        *,
        listing_images (
          id,
          url,
          order_index
        ),
        seller:sellers (
          id,
          company_name,
          watch_pros_name,
          country,
          crypto_friendly,
          company_logo_url
        )
      `, { count: 'exact' })
      .eq('status', 'active')

    // Apply text search if search term exists
    if (search) {
      query = query.textSearch('title', search, {
        type: 'websearch',
        config: 'english'
      })
    }

    // Apply filters
    if (brand) {
      // Check if brand is a UUID (brand_id) or a string (brand_slug)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(brand)
      if (isUUID) {
        query = query.eq('brand_id', brand)
      } else {
        query = query.eq('brand_slug', brand)
      }
    }
    if (model) {
      // Check if model is a UUID (model_id) or a string (model_slug)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(model)
      if (isUUID) {
        query = query.eq('model_id', model)
      } else {
        query = query.eq('model_slug', model)
      }
    }
    if (reference) query = query.ilike('reference', `${reference}%`)
    if (seller) query = query.eq('seller_id', seller)
    if (year) query = query.eq('year', year)
    if (dialColor) query = query.eq('dial_color', dialColor)
    if (condition) query = query.eq('condition', condition)
    if (included) query = query.eq('included', included)
    if (listingType) query = query.eq('listing_type', listingType)
    if (shippingDelay) query = query.eq('shipping_delay', shippingDelay)

    // Apply price range if provided
    if (minPrice) query = query.gte('price', parseInt(minPrice))
    if (maxPrice) query = query.lte('price', parseInt(maxPrice))

    // Apply cursor-based pagination if after is provided
    if (after) {
      query = query.lt('created_at', after)
    }

    // Apply sorting
    query = query.order(sort, { ascending: order === 'asc' })

    // Apply pagination (offset/limit)
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: listings, error, count } = await query

    if (error) {
      console.error('Error fetching listings:', error)
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
    }

    return NextResponse.json({
      listings,
      nextCursor: listings?.[listings.length - 1]?.created_at || null,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
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
    const accessoryType = formData.get('accessory_type') as string
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
    const listingType = formData.get('listing_type') as string
    const country = formData.get('country') as string

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