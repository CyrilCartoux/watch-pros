import { createClient } from '@/lib/supabase/server'
import { NextResponse } from "next/server"

interface Brand {
  id: string
  slug: string
  label: string
}

interface Model {
  id: string
  slug: string
  label: string
}


interface DatabaseActiveSearch {
  id: string
  user_id: string
  title: string
  description: string | null
  type: 'watch' | 'accessory'
  brand_id: string | null
  model_id: string | null
  reference: string | null
  dial_color: string | null
  max_price: number | null
  location: string | null
  accessory_type: string | null
  is_public: boolean
  is_active: boolean
  contact_preferences: {
    email: boolean
    phone: boolean
    whatsapp: boolean
  }
  created_at: string
  updated_at: string
  brands: Brand | null
  models: Model | null
  currency: string | null
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch active searches with related data
    const { data: activeSearches, error } = await supabase
      .from('active_searches')
      .select(`
        *,
        brands (
          id,
          slug,
          label
        ),
        models (
          id,
          slug,
          label
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching active searches:', error)
      return NextResponse.json({ error: "Failed to fetch active searches" }, { status: 500 })
    }

    // Transform the data to match the frontend interface
    const transformedSearches = activeSearches.map((search: DatabaseActiveSearch) => {
      
      return {
        id: search.id,
        title: search.title,
        description: search.description,
        type: search.type,
        brand: search.brands ? {
          id: search.brands.id,
          slug: search.brands.slug,
          label: search.brands.label
        } : null,
        model: search.models ? {
          id: search.models.id,
          slug: search.models.slug,
          label: search.models.label
        } : null,
        reference: search.reference,
        dial_color: search.dial_color,
        max_price: search.max_price,
        location: search.location,
        accessory_type: search.accessory_type,
        currency: search.currency,
        is_public: search.is_public,
        is_active: search.is_active,
        contact_preferences: search.contact_preferences,
        created_at: search.created_at,
        updated_at: search.updated_at
      }
    })

    return NextResponse.json(transformedSearches)

  } catch (error) {
    console.error('Error in search/me API:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 