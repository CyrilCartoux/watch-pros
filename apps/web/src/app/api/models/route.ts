import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// Cache duration in seconds
const CACHE_DURATION = 60 * 60 // 1 hour

// In-memory cache
let modelsCache: {
  data: { [key: string]: any[] } | null
  timestamp: number
} = {
  data: null,
  timestamp: 0
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const brandId = searchParams.get("brand_id")
    const popular = searchParams.get("popular")
    const slugs = searchParams.get("slugs")?.split(",")

    if (!brandId) {
      return NextResponse.json(
        { error: "Brand ID is required" },
        { status: 400 }
      )
    }

    // Check if cache is valid and contains data for this brand
    const now = Date.now()
    if (
      modelsCache.data &&
      now - modelsCache.timestamp < CACHE_DURATION * 1000 &&
      modelsCache.data[brandId]
    ) {
      let filteredModels = modelsCache.data[brandId]

      // Apply filters if needed
      if (popular === "true") {
        filteredModels = filteredModels.filter((model) => model.popular)
      }
      if (slugs) {
        filteredModels = filteredModels.filter((model) => slugs.includes(model.slug))
      }

      return NextResponse.json({ models: filteredModels })
    }

    // If cache is invalid or empty, fetch from database
    const supabase = await createClient()

    let query = supabase
      .from("models")
      .select("*")
      .eq("brand_id", brandId)
      .order("label", { ascending: true })

    // Apply filters if needed
    if (popular === "true") {
      query = query.eq("popular", true)
    }
    if (slugs) {
      query = query.in("slug", slugs)
    }

    const { data: models, error } = await query

    if (error) {
      throw error
    }

    // Update cache
    modelsCache = {
      data: {
        ...(modelsCache.data || {}),
        [brandId]: models
      },
      timestamp: now
    }

    return NextResponse.json({ models })
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    )
  }
} 