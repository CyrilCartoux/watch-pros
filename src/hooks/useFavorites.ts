import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

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
  const { toast } = useToast()

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
          const data = await response.json()
          throw new Error(data.error || "Failed to fetch favorites")
        }
        const data = await response.json()
        setFavorites(data.favorites)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch favorites"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [user, toast])

  // Ajouter un favori
  const addFavorite = async (listingId: string) => {
    if (!user) {
      const errorMessage = "You must be logged in to add favorites"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw new Error(errorMessage)
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
      toast({
        title: "Success",
        description: "Listing added to favorites",
      })
      return favorite
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add favorite"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw err instanceof Error ? err : new Error("Failed to add favorite")
    }
  }

  // Supprimer un favori
  const removeFavorite = async (listingId: string) => {
    if (!user) {
      const errorMessage = "You must be logged in to remove favorites"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      throw new Error(errorMessage)
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
      toast({
        title: "Success",
        description: "Listing removed from favorites",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove favorite"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
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