import { createClient } from '@supabase/supabase-js'
import mockListings from '../data/listings2.json'

const NEXT_PUBLIC_SUPABASE_URL="https://yxherqptduszoafpsapp.supabase.co"
const NEXT_PUBLIC_SUPABASE_ANON_KEY=""

interface ListingDocument {
  type: string;
  url: string;
}

interface Listing {
  brand: string;
  model: string;
  reference: string;
  title: string;
  description: string;
  year: string;
  gender: string;
  condition: string;
  serialNumber: string;
  dialColor: string | null;
  diameter: {
    min: string;
    max: string;
  };
  movement: string | null;
  case: string;
  braceletMaterial: string;
  braceletColor: string;
  included: string;
  images: string[];
  price: number;
  currency: string;
  shippingDelay: string;
  documents: ListingDocument[];
  seller: string;
}

interface MockListings {
  listings: Listing[];
}

async function seedListings() {
  // Create a Supabase client with service role key for admin access
  const supabase = createClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  // Get all brands to map their IDs
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, slug')

  if (brandsError) {
    console.error('Error fetching brands:', brandsError)
    return
  }

  console.log('Brands in database:', brands)

  const brandMap = new Map(brands.map(brand => [brand.slug, brand.id]))

  // Get all models to map their IDs
  const { data: models, error: modelsError } = await supabase
    .from('models')
    .select('id, brand_id, slug')

  if (modelsError) {
    console.error('Error fetching models:', modelsError)
    return
  }

  console.log('Models in database:', models)

  const modelMap = new Map(
    models.map(model => [`${model.brand_id}-${model.slug}`, model.id])
  )

  // Get all sellers to map their IDs
  const { data: sellers, error: sellersError } = await supabase
    .from('sellers')
    .select('id, username')

  if (sellersError) {
    console.error('Error fetching sellers:', sellersError)
    return
  }

  console.log('Sellers in database:', sellers)

  const sellerMap = new Map(sellers.map(seller => [seller.username, seller.id]))

  // Process each listing
  for (const listingData of (mockListings as MockListings).listings) {
    console.log(`Processing listing: ${listingData.title}...`)
    console.log('Looking for brand:', listingData.brand)

    const brandId = brandMap.get(listingData.brand)
    if (!brandId) {
      console.error(`Brand not found: ${listingData.brand}`)
      continue
    }

    const modelId = modelMap.get(`${brandId}-${listingData.model}`)
    if (!modelId) {
      console.error(`Model not found: ${listingData.model} for brand ${listingData.brand}`)
      continue
    }

    // Get seller ID (use first seller if not specified)
    const sellerId = listingData.seller 
      ? sellerMap.get(listingData.seller)
      : sellers[0].id

    if (!sellerId) {
      console.error(`Seller not found: ${listingData.seller}`)
      continue
    }

    // Insert listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        reference_id: listingData.reference,
        seller_id: sellerId,
        brand_id: brandId,
        model_id: modelId,
        reference: listingData.reference,
        title: listingData.title,
        description: listingData.description,
        year: listingData.year,
        gender: listingData.gender,
        serial_number: listingData.serialNumber,
        dial_color: listingData.dialColor,
        diameter_min: parseInt(listingData.diameter.min),
        diameter_max: parseInt(listingData.diameter.max),
        movement: listingData.movement,
        case_material: listingData.case,
        bracelet_material: listingData.braceletMaterial,
        bracelet_color: listingData.braceletColor,
        included: listingData.included,
        condition: listingData.condition,
        price: listingData.price,
        currency: listingData.currency,
        shipping_delay: listingData.shippingDelay,
        status: 'active'
      })
      .select()
      .single()

    if (listingError) {
      console.error(`Error inserting listing ${listingData.title}:`, listingError)
      continue
    }

    // Insert images
    if (listingData.images && listingData.images.length > 0) {
      const images = listingData.images.map((url, index) => ({
        listing_id: listing.id,
        url,
        order_index: index
      }))

      const { error: imagesError } = await supabase
        .from('listing_images')
        .insert(images)

      if (imagesError) {
        console.error(`Error inserting images for ${listingData.title}:`, imagesError)
      }
    }

    // Insert documents
    if (listingData.documents && listingData.documents.length > 0) {
      const documents = listingData.documents.map(doc => ({
        listing_id: listing.id,
        document_type: doc.type,
        url: doc.url
      }))

      const { error: documentsError } = await supabase
        .from('listing_documents')
        .insert(documents)

      if (documentsError) {
        console.error(`Error inserting documents for ${listingData.title}:`, documentsError)
      }
    }

    console.log(`Successfully processed ${listingData.title}`)
  }

  console.log('Seeding completed!')
}

seedListings().catch(console.error) 