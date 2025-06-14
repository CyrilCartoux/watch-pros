"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

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
  page: number
  limit: number
  totalPages: number
}

const statusConfig = {
  sold: {
    icon: CheckCircle2,
    color: "text-green-500",
    label: "Sold"
  },
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    label: "Pending"
  },
  cancelled: {
    icon: AlertCircle,
    color: "text-red-500",
    label: "Cancelled"
  }
}

export function SalesTab() {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/listings/me/sold')
      if (!response.ok) {
        throw new Error('Failed to fetch sales')
      }
      const data: SalesResponse = await response.json()
      setSales(data.listings)

      // Calculate statistics
      const totalRevenue = data.listings.reduce((sum, sale) => sum + sale.price, 0)
      setStats({
        totalSales: data.total,
        totalRevenue
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
            <CardDescription>Total sales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} €</p>
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
    </div>
  )
}