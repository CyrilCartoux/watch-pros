import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface Brand {
  id: string
  slug: string
  label: string
  popular: boolean
}

interface Model {
  id: string
  brand_id: string
  slug: string
  label: string
  popular: boolean
}

interface BrandsAndModelsContextType {
  brands: Brand[]
  models: { [key: string]: Model[] }
  isLoading: boolean
  error: string | null
  fetchModels: (brandId: string) => Promise<void>
}

const BrandsAndModelsContext = createContext<BrandsAndModelsContextType | undefined>(undefined)

export function BrandsAndModelsProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<{ [key: string]: Model[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands")
        if (!response.ok) {
          throw new Error("Failed to fetch brands")
        }
        const data = await response.json()
        setBrands(data.brands)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brands")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Function to fetch models for a specific brand
  const fetchModels = async (brandId: string) => {
    try {
      // If we already have the models for this brand, don't fetch again
      if (models[brandId]) return

      const response = await fetch(`/api/models?brand_id=${brandId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(prev => ({
        ...prev,
        [brandId]: data.models
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models")
    }
  }

  return (
    <BrandsAndModelsContext.Provider
      value={{
        brands,
        models,
        isLoading,
        error,
        fetchModels
      }}
    >
      {children}
    </BrandsAndModelsContext.Provider>
  )
}

export function useBrandsAndModels() {
  const context = useContext(BrandsAndModelsContext)
  if (context === undefined) {
    throw new Error("useBrandsAndModels must be used within a BrandsAndModelsProvider")
  }
  return context
} 