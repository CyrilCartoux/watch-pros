import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

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
  listing_type: string;
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
          company_logo_url,
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
          crypto_friendly,
          seller_stats (
            total_reviews,
            average_rating
          ),
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
      .eq('status', 'active')
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
      accessory_type: listing.accessory_type,
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
      country: listing.country,
      images: listing.listing_images
        .sort((a: ListingImage, b: ListingImage) => a.order_index - b.order_index)
        .map((img: ListingImage) => img.url),
      price: listing.price,
      currency: listing.currency,
      shippingDelay: listing.shipping_delay,
      listing_type: listing.listing_type,
      seller: listing.sellers ? {
        id: listing.sellers.id,
        name: listing.sellers.watch_pros_name,
        companyLogo: listing.sellers.company_logo_url,
        type: listing.sellers.company_status,
        description: listing.sellers.title,
        cryptoFriendly: listing.sellers.crypto_friendly,
        location: {
          address: listing.sellers.seller_addresses[0]?.street || '',
          city: listing.sellers.seller_addresses[0]?.city || '',
          postalCode: listing.sellers.seller_addresses[0]?.postal_code || '',
          country: listing.sellers.seller_addresses[0]?.country || listing.sellers.country
        },
        stats: {
          totalReviews: listing.sellers.seller_stats?.total_reviews || 0,
          averageRating: listing.sellers.seller_stats?.average_rating || 0
        },
        contact: {
          phone: `${listing.sellers.phone_prefix}${listing.sellers.phone}`,
          mobile: `${listing.sellers.phone_prefix}${listing.sellers.phone}`,
          email: listing.sellers.email
        }
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get listing images before deletion
    const { data: listingImages, error: imagesError } = await supabase
      .from('listing_images')
      .select('url')
      .eq('listing_id', params.id)

    if (imagesError) {
      console.error('Error fetching listing images:', imagesError)
      return NextResponse.json(
        { error: 'Failed to fetch listing images' },
        { status: 500 }
      )
    }

    // Delete images from storage
    if (listingImages && listingImages.length > 0) {
      console.log('deleting images', listingImages)
      const imagePaths = listingImages.map(img => {
        // Extract the path from the URL
        const url = new URL(img.url)
        const path = url.pathname.split('/').pop()
        return path || ''
      }).filter(path => path !== '')

      console.log('imagesPaths', imagePaths)

      if (imagePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('listingimages')
          .remove(imagePaths)

        if (storageError) {
          console.error('Error deleting images from storage:', storageError)
          return NextResponse.json(
            { error: 'Failed to delete images from storage' },
            { status: 500 }
          )
        }
      }
    }

    // Delete the listing (this will cascade delete related records)
    const { error: deleteError } = await supabase
      .from('listings')
      .delete()
      .eq('id', params.id)
      .eq('seller_id', seller.id)

    if (deleteError) {
      console.error('Error deleting listing:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete listing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in delete listing API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // Verify that the listing belongs to the seller
    const { data: existingListing, error: listingError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', params.id)
      .eq('seller_id', seller.id)
      .single()

    if (listingError || !existingListing) {
      return NextResponse.json(
        { error: 'Listing not found or unauthorized' },
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

    // Update the listing
    const { data: updatedListing, error: updateError } = await supabase
      .from('listings')
      .update({
        accessory_type: accessoryType,
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
        listing_type: listingType
      })
      .eq('id', params.id)
      .eq('seller_id', seller.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating listing:', updateError)
      return NextResponse.json(
        { error: 'Failed to update listing' },
        { status: 500 }
      )
    }

    // Handle image uploads
    const images = formData.getAll('images')
    console.log('Received images:', images.length, 'items')
    
    if (images.length > 0) {
      // Delete existing images
      const { error: deleteImagesError } = await supabase
        .from('listing_images')
        .delete()
        .eq('listing_id', params.id)

      if (deleteImagesError) {
        console.error('Error deleting existing images:', deleteImagesError)
        return NextResponse.json(
          { error: 'Failed to delete existing images' },
          { status: 500 }
        )
      }

      const imageUploadPromises = images.map(async (image, index) => {
        try {

          // Check if it's a URL (either as string or in File name)
          const isUrl = typeof image === 'string' || 
                       (image instanceof File && image.name.startsWith('http'))

          if (isUrl) {
            const imageUrl = typeof image === 'string' ? image : image.name
            
            // Insert the existing image URL into the database
            const { data: imageData, error: imageError } = await supabase
              .from('listing_images')
              .insert({
                listing_id: params.id,
                url: imageUrl,
                order_index: index
              })
              .select()
              .single()

            if (imageError) {
              console.error(`Error inserting existing image record ${index}:`, imageError)
              throw new Error(`Failed to create image record ${index}: ${imageError.message}`)
            }

            return imageData
          }

          // Handle new file uploads
          if (!(image instanceof File)) {
            console.error(`Invalid image type at index ${index}:`, image)
            throw new Error(`Invalid image type at index ${index}`)
          }

          if (image.size === 0) {
            console.error(`Empty file at index ${index}:`, image)
            throw new Error(`Empty file at index ${index}`)
          }

          // Validate image type
          if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
            throw new Error(`Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
          }

          // Convert File to ArrayBuffer
          const arrayBuffer = await image.arrayBuffer()
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            throw new Error(`Empty buffer for image at index ${index}`)
          }

          // Optimize image using the existing function
          const optimizedBuffer = await optimizeImage(image)

          // Create a unique file name with extension
          const fileExt = 'jpg' // We always convert to jpg for consistency
          const imageFileName = `${params.id}/${model}-${reference}-${listingType}-${index + 1}.${fileExt}`

          // Upload optimized image to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listingimages')
            .upload(imageFileName, optimizedBuffer, {
              contentType: 'image/jpeg',
              upsert: true,
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
              listing_id: params.id,
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
          throw error
        }
      })

      try {
        await Promise.all(imageUploadPromises)
      } catch (error) {
        console.error('Error uploading images:', error)
        return NextResponse.json(
          { error: 'Failed to upload images' },
          { status: 500 }
        )
      }
    }

    // Handle document uploads
    const documents = formData.getAll('documents') as File[]
    if (documents.length > 0) {
      const documentUploadPromises = documents.map(async (document) => {
        try {
          // Skip if the document is a URL (existing document)
          if (typeof document === 'string' || document instanceof String) {
            return null
          }

          // Convert File to ArrayBuffer
          const arrayBuffer = await document.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          // Create a unique file name with extension
          const fileExtension = document.name.split('.').pop()
          const fileName = `${params.id}/documents/${document.name}`

          // Upload file to storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('listingdocuments')
            .upload(fileName, buffer, {
              contentType: document.type,
              upsert: true,
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
              listing_id: params.id,
              document_type: fileExtension?.toUpperCase() || 'OTHER',
              url: publicUrl
            })
        } catch (error) {
          console.error(`Error processing document:`, error)
          throw error
        }
      })

      try {
        await Promise.all(documentUploadPromises)
      } catch (error) {
        console.error('Error uploading documents:', error)
        return NextResponse.json(
          { error: 'Failed to upload documents' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true, listing: updatedListing })
  } catch (error) {
    console.error('Error in PUT /api/listings/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Get the request body
    const { finalPrice } = await request.json()

    // Update the listing status to sold
    const { data: updatedListing, error: updateError } = await supabase
      .from('listings')
      .update({
        status: 'sold',
        final_price: finalPrice || null
      })
      .eq('id', params.id)
      .eq('seller_id', seller.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating listing status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update listing status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, listing: updatedListing })
  } catch (error) {
    console.error('Error in PATCH /api/listings/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 