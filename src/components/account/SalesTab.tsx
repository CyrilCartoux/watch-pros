"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Sale {
  id: string
  title: string
  price: number
  status: string
  type: string
  brand: string
  model: string
  image: string | null
  createdAt: string
  updatedAt: string
  soldAt: string
}

interface SalesResponse {
  listings: Sale[]
  total: number
  totalAmount: number
  page: number
  limit: number
  totalPages: number
}

const statusConfig = {
  sold: {
    label: "Vendu",
    color: "text-green-600",
    icon: CheckCircle2
  },
  active: {
    label: "Actif",
    color: "text-blue-600",
    icon: Clock
  },
  inactive: {
    label: "Inactif",
    color: "text-gray-600",
    icon: AlertCircle
  }
}

export function SalesTab() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalAmount: 0
  })
  const { toast } = useToast()

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/listings/me/sold?page=${currentPage}&limit=12`)
      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }
      const data: SalesResponse = await response.json()
      setSales(data.listings)
      setTotalPages(data.totalPages)
      setStats({
        totalSales: data.total,
        totalAmount: data.totalAmount
      })
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast({
        title: "Error",
        description: "Unable to load sales",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-2" />
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>Number of watches sold</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalSales}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Total sales amount</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalAmount.toLocaleString()} €</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {sales.map((sale) => {
          const status = statusConfig[sale.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <Card key={sale.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    {sale.image ? (
                      <Image
                        src={sale.image}
                        alt={sale.title}
                        fill
                        sizes="96px"
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{sale.title}</h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <span className={`text-sm ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold mt-1">{sale.price.toLocaleString()} €</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        {sale.brand} {sale.model}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        • Sold on {new Date(sale.soldAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1
              if (totalPages <= 5) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              }
              if (pageNumber === 1 || pageNumber === totalPages) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              }
              if (pageNumber === 2 && currentPage > 3) {
                return <span key="start-ellipsis">...</span>
              }
              if (pageNumber === totalPages - 1 && currentPage < totalPages - 2) {
                return <span key="end-ellipsis">...</span>
              }
              if (Math.abs(currentPage - pageNumber) <= 1) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              }
              return null
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} sur {totalPages}
          </span>
          <Select
            value={currentPage.toString()}
            onValueChange={(value) => handlePageChange(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}