import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/favorites
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Récupérer les favoris de l'utilisateur avec les détails des listings
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select(`
        *,
        listings (
          id,
          title,
          price,
          currency,
          brand_id,
          model_id,
          reference,
          listing_images (
            url
          ),
          brands (
            slug,
            label
          ),
          models (
            slug,
            label
          )
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    )
  }
}

// POST /api/favorites
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Récupérer le listing_id depuis le body
    const { listing_id } = await request.json()
    if (!listing_id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    // Vérifier si le listing existe et appartient à l'utilisateur
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id, seller_id")
      .eq("id", listing_id)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    // Vérifier si l'utilisateur est le vendeur de l'annonce
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("seller_id")
      .eq("id", user.id)
      .single()

    if (userProfile?.seller_id === listing.seller_id) {
      return NextResponse.json(
        { error: "You cannot favorite your own listing" },
        { status: 400 }
      )
    }

    // Vérifier si le favori existe déjà
    const { data: existingFavorite } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listing_id)
      .single()

    if (existingFavorite) {
      return NextResponse.json(
        { error: "Listing is already in favorites" },
        { status: 400 }
      )
    }

    // Ajouter le favori
    const { data: favorite, error: favoriteError } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        listing_id
      })
      .select()
      .single()

    if (favoriteError) {
      throw favoriteError
    }

    return NextResponse.json({ favorite })
  } catch (error) {
    console.error("Error adding favorite:", error)
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Récupérer le listing_id depuis l'URL
    const { searchParams } = new URL(request.url)
    const listing_id = searchParams.get("listing_id")
    if (!listing_id) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    // Supprimer le favori
    const { error: deleteError } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listing_id)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing favorite:", error)
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    )
  }
} 