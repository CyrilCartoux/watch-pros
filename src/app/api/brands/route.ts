import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

// Cache duration in seconds
const CACHE_DURATION = 60 * 60 // 1 hour

// In-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number }>()

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (!cached) return null

  const now = Date.now()
  if (now - cached.timestamp > CACHE_DURATION * 1000) {
    cache.delete(key)
    return null
  }

  return cached.data
}

function setCachedData(key: string, data: any) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")
    const slugs = searchParams.get("slugs")?.split(",")

    // Generate cache key based on parameters
    const cacheKey = `brands:${popular}:${slugs?.join(',') || 'all'}`

    // Check cache
    const cachedData = getCachedData(cacheKey)
    if (cachedData) {
      return NextResponse.json(
        { brands: cachedData },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
          },
        }
      )
    }

    // If not in cache, fetch from database
    const supabase = await createClient()

    let query = supabase
      .from("brands")
      .select("*")
      .order("label", { ascending: true })

    // Apply filters if needed
    if (popular === "true") {
      query = query.eq("popular", true)
    }
    if (slugs) {
      query = query.in("slug", slugs)
    }

    const { data: brands, error } = await query

    if (error) {
      throw error
    }

    // Update cache
    setCachedData(cacheKey, brands)

    return NextResponse.json(
      { brands },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        },
      }
    )
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    )
  }
} 