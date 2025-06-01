import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

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

export async function GET() {
  try {
    // Check if cache is valid
    const now = Date.now()
    if (brandsCache.data && now - brandsCache.timestamp < CACHE_DURATION * 1000) {
      return NextResponse.json({ brands: brandsCache.data })
    }

    // If cache is invalid or empty, fetch from database
    const supabase = await createClient()

    const { data: brands, error } = await supabase
      .from("brands")
      .select("*")
      .order("label", { ascending: true })

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