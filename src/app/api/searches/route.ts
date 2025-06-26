import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logApiError, logApiSuccess, ErrorWithMessage } from '@/utils/logger'
import { ActiveSearchInsert } from '@/types/db/ActiveSearches'

interface SearchResult {
  profiles?: {
    stripe_customer_id?: string
    seller_id?: string
    [key: string]: any
  }
  seller?: {
    id_card_back_url?: string
    id_card_front_url?: string
    proof_of_address_url?: string
    company_logo_url?: string
    search_vector?: string
    user_id?: string
    created_at?: string
    updated_at?: string
    [key: string]: any
  }
  full_count?: string
  [key: string]: any
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const model = searchParams.get('model')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const mySearches = searchParams.get('mySearches') === 'true'

    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      logApiError(userError || new Error('User not found'), 'searches-get-user', request)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Convert slugs to UUIDs if needed
    let brandId = brand
    let modelId = model
    
    if (brand) {
      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('slug', brand)
        .single()
      
      if (brandData) {
        brandId = brandData.id
      } else {
        // If brand not found, return empty results
        return NextResponse.json({
          searches: [],
          pagination: {
            page,
            limit,
            totalPages: 0,
            count: 0
          }
        })
      }
    }
    
    if (model && brandId) {
      const { data: modelData } = await supabase
        .from('models')
        .select('id')
        .eq('slug', model)
        .eq('brand_id', brandId)
        .single()
      
      if (modelData) {
        modelId = modelData.id
      } else {
        // If model not found, return empty results
        return NextResponse.json({
          searches: [],
          pagination: {
            page,
            limit,
            totalPages: 0,
            count: 0
          }
        })
      }
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    if (mySearches) {
      // Pour les recherches de l'utilisateur connecté, utiliser une requête simple
      let query = supabase
        .from('active_searches')
        .select(`
          *,
          profiles:user_id (
            id,
            first_name,
            last_name,
            email
          ),
          brands:brand_id (
            id,
            slug,
            label
          ),
          models:model_id (
            id,
            slug,
            label
          ),
          sellers:user_id (
            id,
            company_name,
            watch_pros_name,
            company_status,
            first_name,
            last_name,
            email,
            country,
            title,
            phone_prefix,
            phone,
            crypto_friendly,
            identity_verified
          )
        `)
        .eq('user_id', user.id)

      // Apply filters
      if (type) {
        query = query.eq('type', type)
      }
      if (brandId) {
        query = query.eq('brand_id', brandId)
      }
      if (modelId) {
        query = query.eq('model_id', modelId)
      }
      if (maxPrice) {
        query = query.lte('max_price', parseFloat(maxPrice))
      }
      if (location) {
        query = query.eq('location', location)
      }

      // Get total count for pagination
      const { count } = await query

      // Apply pagination
      query = query.range(offset, offset + limit - 1)
      query = query.order('created_at', { ascending: false })

      const { data: searches, error } = await query

      if (error) {
        logApiError(error, 'searches-get', request)
        return NextResponse.json(
          { error: 'Failed to fetch active searches' },
          { status: 500 }
        )
      }

      const totalPages = Math.ceil((count || 0) / limit)

      logApiSuccess({ searches, pagination: { page, limit, totalPages, count } }, 'searches-get')
      
      return NextResponse.json({
        searches,
        pagination: {
          page,
          limit,
          totalPages,
          count
        }
      })
    } else {
      // Pour les recherches publiques, utiliser la fonction RPC optimisée
      const { data: searches, error } = await supabase
        .rpc('rpc_search_active_searches', {
          _search: search || null,
          _type: type || null,
          _brand_id: brandId || null,
          _model_id: modelId || null,
          _reference: null, // Pas encore utilisé dans les filtres
          _dial_color: null, // Pas encore utilisé dans les filtres
          _location: location || null,
          _accessory_type: null, // Pas encore utilisé dans les filtres
          _max_price: maxPrice ? parseFloat(maxPrice) : null,
          _country: null, // Pas encore utilisé dans les filtres
          _limit: limit,
          _offset: offset
        })

      if (error) {
        logApiError(error, 'searches-get-rpc', request)
        return NextResponse.json(
          { error: 'Failed to fetch active searches' },
          { status: 500 }
        )
      }

      // Clean sensitive data from searches
      const cleanedSearches = searches?.map((search: SearchResult) => {
        if (search.profiles) {
          const { stripe_customer_id, seller_id, ...cleanProfile } = search.profiles
          search.profiles = cleanProfile
        }
        if (search.seller) {
          const { 
            id_card_back_url, 
            id_card_front_url, 
            proof_of_address_url, 
            company_logo_url,
            search_vector,
            user_id,
            created_at,
            updated_at,
            ...cleanSeller 
          } = search.seller
          search.seller = cleanSeller
        }
        return search
      }) || []

      // Récupère full_count depuis le résultat du RPC
      const fullCount = cleanedSearches && cleanedSearches.length > 0 ? Number(cleanedSearches[0].full_count) : 0
      const totalPages = Math.ceil(fullCount / limit)
      
      return NextResponse.json({
        searches: cleanedSearches,
        pagination: {
          page,
          limit,
          totalPages,
          count: fullCount
        }
      })
    }
  } catch (error) {
    logApiError(error as ErrorWithMessage, 'searches-get', request)
    return NextResponse.json(
      { error: 'An error occurred while fetching active searches' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      logApiError(userError || new Error('User not found'), 'searches-post-user', request)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const searchData: ActiveSearchInsert = {
      ...body,
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('active_searches')
      .insert(searchData)
      .select()
      .single()

    if (error) {
      logApiError(error, 'searches-post', request)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logApiSuccess(data, 'searches-post')
    return NextResponse.json({ 
      data,
      message: 'Active search created successfully'
    })
  } catch (error) {
    logApiError(error as ErrorWithMessage, 'searches-post', request)
    return NextResponse.json(
      { error: 'An error occurred while creating active search' },
      { status: 500 }
    )
  }
} 