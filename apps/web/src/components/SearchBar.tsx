"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { brandsList } from "@/data/brands-list"
import { modelsList } from "@/data/models-list"

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
    brandsList.forEach(brand => {
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
    Object.entries(modelsList).forEach(([brandSlug, models]) => {
      const brand = brandsList.find(b => b.slug === brandSlug)
      if (!brand) return

      models.forEach((model: any) => {
        // Check if search matches "brand model" or just "model"
        const fullSearch = `${brand.label} ${model.label}`.toLowerCase()
        if (fullSearch.includes(searchLower) || model.label.toLowerCase().includes(searchLower)) {
          newResults.push({
            type: "model",
            label: `${brand.label} ${model.label}`,
            brandSlug,
            modelSlug: model.slug
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
    setSearch(query)
    router.push(`/listings?query=${encodeURIComponent(query)}`)
    setIsOpen(false)
  }

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for a watch..."
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