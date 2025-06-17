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
    } else {
      // Check if it's a brand from suggestions
      const brandResult = results.find(result => result.type === "brand" && result.label === query)
      
      if (brandResult) {
        params.set('brand', brandResult.brandSlug)
        setSearch(brandResult.label)
      } else {
        // Check if it's a brand in uniqueBrands
        const brand = uniqueBrands.find(b => 
          b.label.toLowerCase() === trimmed.toLowerCase() || 
          b.slug === trimmed.toLowerCase()
        )

        if (brand) {
          params.set('brand', brand.slug)
          setSearch(brand.label)
        } else {
          // Check if it looks like a reference number (alphanumeric with possible dots)
          const isReference = /^[A-Za-z0-9.]+$/.test(trimmed)
          
          if (isReference) {
            params.set('reference', trimmed)
            setSearch(trimmed)
          } else {
            // If no brand/model/reference match found, use as free text search
            params.set('query', trimmed)
            setSearch(trimmed)
          }
        }
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