"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { models } from "@/data/models"

interface Model {
  model_label: string
  model_slug: string
  brand_label: string
  brand_slug: string
}

interface SearchResult {
  type: "brand" | "model"
  label: string
  brandSlug: string
  modelSlug?: string
  image?: string
}

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get unique brands from models data
  const uniqueBrands = Object.entries(models).map(([brandSlug, brandModels]) => {
    const firstModel = brandModels[0]
    return {
      label: firstModel.brand_label,
      slug: brandSlug
    }
  })

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update search results
  useEffect(() => {
    if (!search) {
      setResults([])
      return
    }

    const searchLower = search.toLowerCase()
    const newResults: SearchResult[] = []

    // Search in brands
    uniqueBrands.forEach(brand => {
      if (brand.label.toLowerCase().includes(searchLower)) {
        newResults.push({
          type: "brand",
          label: brand.label,
          brandSlug: brand.slug,
          image: `/images/brands/${brand.slug}.png`
        })
      }
    })

    // Search in models
    Object.entries(models).forEach(([brandSlug, brandModels]) => {
      brandModels.forEach(model => {
        // Check if search matches "brand model" or just "model"
        const fullSearch = `${model.brand_label} ${model.model_label}`.toLowerCase()
        if (fullSearch.includes(searchLower) || model.model_label.toLowerCase().includes(searchLower)) {
          newResults.push({
            type: "model",
            label: `${model.brand_label} ${model.model_label}`,
            brandSlug: model.brand_slug,
            modelSlug: model.model_slug
          })
        }
      })
    })

    // Sort results: brands first, then models
    newResults.sort((a, b) => {
      if (a.type === b.type) {
        return a.label.localeCompare(b.label)
      }
      return a.type === "brand" ? -1 : 1
    })

    setResults(newResults)
  }, [search])

  const handleSearch = (query: string) => {
    if (!query) return

    const params = new URLSearchParams()
    const trimmed = query.trim()
    const tokens = trimmed.split(/\s+/)

    // Find if the query matches a model result from suggestions
    const modelResult = results.find(result => result.type === "model" && result.label === query)
    
    if (modelResult) {
      // If it's a model from suggestions, use brand and model parameters
      params.set('brand', modelResult.brandSlug)
      if (modelResult.modelSlug) {
        params.set('model', modelResult.modelSlug)
      }
      // Update the search input with the selected value
      setSearch(modelResult.label)
    } else if (tokens.length === 1) {
      // Single token - could be a reference number or brand
      const single = tokens[0].toLowerCase()
      
      // Check if it's a brand
      const brand = uniqueBrands.find(b => 
        b.slug === single || b.label.toLowerCase() === single
      )
      
      if (brand) {
        params.set('brand', brand.slug)
        // Update the search input with the brand name
        setSearch(brand.label)
      } else {
        // If not a brand, treat as reference number
        params.set('reference', trimmed)
        // Keep the reference number in the search input
        setSearch(trimmed)
      }
    } else {
      // Multiple tokens - try to find brand and model
      const brand = uniqueBrands.find(b => 
        tokens.some(token => 
          b.slug === token.toLowerCase() || 
          b.label.toLowerCase() === token.toLowerCase()
        )
      )

      if (brand) {
        params.set('brand', brand.slug)
        
        // Look for matching model
        const brandModels = models[brand.slug] || []
        const model = brandModels.find(m => 
          tokens.some(token => 
            m.model_slug === token.toLowerCase() || 
            m.model_label.toLowerCase() === token.toLowerCase()
          )
        )

        if (model) {
          params.set('model', model.model_slug)
          // Update the search input with the brand and model name
          setSearch(`${model.brand_label} ${model.model_label}`)
        } else {
          // If only brand is found, update with brand name
          setSearch(brand.label)
        }
      } else {
        // If no brand/model match found, use as free text search
        params.set('query', trimmed)
        // Keep the original search text
        setSearch(trimmed)
      }
    }

    router.push(`/listings?${params.toString()}`)
    setIsOpen(false)
  }

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for a watch, model or reference number..."
          className="pl-9 h-9 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(search)
            }
          }}
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div ref={menuRef} className="absolute top-full left-0 right-0 mt-1 bg-popover rounded-md border shadow-md z-50">
          <Command>
            <CommandList>
              {results.length === 0 && search && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}

              {results.length > 0 && (
                <CommandGroup>
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.brandSlug}-${result.modelSlug || index}`}
                      onClick={() => handleSearch(result.label)}
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    >
                      {result.type === "brand" && result.image && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={result.image}
                            alt={result.label}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <span>{result.label}</span>
                    </button>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}

      <Button
        size="sm"
        className="h-9"
        onClick={() => handleSearch(search)}
      >
        Search
      </Button>
    </div>
  )
}