"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Award, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Seller {
  account: {
    companyName: string
    watchProsName: string
    companyStatus: string
    firstName: string
    lastName: string
    email: string
    username: string
    country: string
    title: string
    phonePrefix: string
    phone: string
    language: string
  }
  address: {
    street: string
    city: string
    country: string
    postalCode: string
    website: string
  } | null
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  const fetchSellers = async (page: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sellers?page=${page}&limit=10`)
      if (!response.ok) {
        throw new Error('Failed to fetch sellers')
      }
      const data = await response.json()
      setSellers(data.sellers)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers(1)
  }, [])

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => fetchSellers(1)}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Certified Sellers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our selection of certified professional sellers, experts in luxury watches.
            Each seller is rigorously selected to ensure an exceptional buying experience.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
            All sellers
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            With physical store
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            Rolex Expert
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            Patek Philippe Expert
          </Badge>
        </div>

        {/* Sellers list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : (
            sellers.map((seller) => (
              <Link key={seller.account.username} href={`/sellers/${seller.account.username}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                        <div className="text-2xl font-bold text-primary">
                          {seller.account.companyName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold mb-1 truncate">{seller.account.companyName}</h2>
                        <p className="text-sm text-muted-foreground mb-2 truncate">{seller.account.companyStatus}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">New Seller</Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {seller.account.firstName} {seller.account.lastName}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-muted-foreground truncate">
                        {seller.address?.city}, {seller.address?.country}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">Certified Seller</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground truncate max-w-[70%]">
                          Contact: {seller.account.email}
                        </span>
                        <span className="text-sm font-medium text-primary flex-shrink-0">
                          View profile →
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => fetchSellers(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === pagination.currentPage ? "default" : "outline"}
                  onClick={() => fetchSellers(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => fetchSellers(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}