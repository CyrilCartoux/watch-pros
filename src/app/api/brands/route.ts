import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export const dynamic = 'force-dynamic'

// Cache duration in seconds
const CACHE_DURATION = 60 * 60 // 1 hour

// In-memory cache
let brandsCache: {
  data: any[] | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get("popular")
    const slugs = searchParams.get("slugs")?.split(",")

    // Check if cache is valid
    const now = Date.now()
    if (brandsCache.data && now - brandsCache.timestamp < CACHE_DURATION * 1000) {
      let filteredBrands = brandsCache.data

      // Apply filters if needed
      if (popular === "true") {
        filteredBrands = filteredBrands.filter((brand) => brand.popular)
      }
      if (slugs) {
        filteredBrands = filteredBrands.filter((brand) => slugs.includes(brand.slug))
      }

      return NextResponse.json({ brands: filteredBrands })
    }

    // If cache is invalid or empty, fetch from database
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
    brandsCache = {
      data: brands,
      timestamp: now
    }

    return NextResponse.json({ brands })
  } catch (error) {
    console.error("Error fetching brands:", error)
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    )
  }
} 