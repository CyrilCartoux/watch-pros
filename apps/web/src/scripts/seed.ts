import { createClient } from '../lib/supabase/client'
import { brandsList } from '../data/brands-list'
import { modelsList } from '../data/models-list'
import { createBrowserClient } from '@supabase/ssr'
async function seed() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Insert brands
  console.log('Inserting brands...')
  for (const brand of brandsList) {
    const { error } = await supabase
      .from('brands')
      .insert({
        slug: brand.slug,
        label: brand.label
      })
    
    if (error) {
      console.error(`Error inserting brand ${brand.label}:`, error)
    }
  }

  // Get all brands to map their IDs
  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, slug')

  if (brandsError) {
    console.error('Error fetching brands:', brandsError)
    return
  }

  const brandMap = new Map(brands.map(brand => [brand.slug, brand.id]))

  // Insert models
  console.log('Inserting models...')
  for (const [brandSlug, models] of Object.entries(modelsList)) {
    const brandId = brandMap.get(brandSlug)
    if (!brandId) {
      console.error(`Brand not found: ${brandSlug}`)
      continue
    }

    for (const model of models) {
      const { error } = await supabase
        .from('models')
        .insert({
          brand_id: brandId,
          slug: model.slug,
          label: model.label
        })
      
      if (error) {
        console.error(`Error inserting model ${model.label}:`, error)
      }
    }
  }

  console.log('Seeding completed!')
}

seed().catch(console.error) 