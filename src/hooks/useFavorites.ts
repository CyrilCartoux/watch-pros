import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"

interface Favorite {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listings: {
    id: string
    title: string
    price: number
    currency: string
    reference: string
    listing_images: {
      url: string
    }[]
    brands: {
      slug: string
      label: string
    }
    models: {
      slug: string
      label: string
    }
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Charger les favoris
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/favorites")
        if (!response.ok) {
          throw new Error("Failed to fetch favorites")
        }
        const data = await response.json()
        setFavorites(data.favorites)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch favorites")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  // Ajouter un favori
  const addFavorite = async (listingId: string) => {
    if (!user) {
      throw new Error("You must be logged in to add favorites")
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing_id: listingId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add favorite")
      }

      const { favorite } = await response.json()
      setFavorites(prev => [favorite, ...prev])
      return favorite
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to add favorite")
    }
  }

  // Supprimer un favori
  const removeFavorite = async (listingId: string) => {
    if (!user) {
      throw new Error("You must be logged in to remove favorites")
    }

    try {
      const response = await fetch(`/api/favorites?listing_id=${listingId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove favorite")
      }

      setFavorites(prev => prev.filter(fav => fav.listing_id !== listingId))
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to remove favorite")
    }
  }

  // Vérifier si un listing est en favori
  const isFavorite = (listingId: string) => {
    return favorites.some(fav => fav.listing_id === listingId)
  }

  return {
    favorites,
    isLoading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
} 