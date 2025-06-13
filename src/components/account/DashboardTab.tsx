"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
  counts: {
    active: number
    draft: number
    sold: number
  }
  monthly: Array<{
    month: string
    total: number
    sold: number
    avg_sale_price: number
  }>
  by_brand: Array<{
    label: string
    cnt: number
    sold: number
    avg_sale_price: number
  }>
  by_model: Array<{
    label: string
    cnt: number
    sold: number
    avg_sale_price: number
  }>
  by_condition: Array<{
    condition: string
    cnt: number
    sold: number
    avg_sale_price: number
  }>
  quota: {
    max: number
    used: number
  }
  offers: {
    total_offers: number
    avg_offer: number
    accepted_offers: number
    avg_accepted_offer: number
  }
  conversion: {
    conv_rate: number
    avg_sale_price: number
    min_sale_price: number
    max_sale_price: number
  }
  avg_sale_days: {
    avg_days: number
    min_days: number
    max_days: number
  }
  stats: {
    total_reviews: number
    average_rating: number
  }
  sales_stats: {
    total_sales: number
    this_week_sales: number
    this_month_sales: number
    this_year_sales: number
  }
  recent_reviews: Array<{
    rating: number
    comment: string
    created_at: string
    reviewer: string
  }>
  approvals: {
    total_approvals: number
  }
}

export function DashboardTab() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Get current seller ID
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        const { data: seller } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .single()

        if (!seller) throw new Error("Seller not found")

        // Fetch dashboard data
        const response = await fetch(`/api/sellers/${seller.id}/dashboard`)
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.active}</div>
            <p className="text-xs text-muted-foreground">
              {data.counts.draft} in draft
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.sold}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((data.conversion?.conv_rate || 0) * 100)}% conversion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(data.conversion?.avg_sale_price || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              €{(data.conversion?.min_sale_price || 0).toLocaleString()} - €{(data.conversion?.max_sale_price || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.avg_sale_days?.avg_days || 0)} days</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(data.avg_sale_days?.min_days || 0)} - {Math.round(data.avg_sale_days?.max_days || 0)} days
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Sales Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{data.sales_stats.total_sales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{data.sales_stats.this_week_sales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{data.sales_stats.this_month_sales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{data.sales_stats.this_year_sales.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Activity</CardTitle>
          <CardDescription>Listings and sales over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" name="Total Listings" fill="#8884d8" />
                <Bar dataKey="sold" name="Sold Items" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Brand Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Distribution</CardTitle>
          <CardDescription>Your listings by brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.by_brand.map((brand) => (
              <div key={brand.label} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{brand.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {brand.sold} sold of {brand.cnt} total
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">€{(brand.avg_sale_price || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">avg. sale price</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quota Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Listing Quota</CardTitle>
          <CardDescription>Your current subscription usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Used</span>
              <span className="text-sm text-muted-foreground">
                {data.quota.used} of {data.quota.max || '∞'}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${data.quota.max ? (data.quota.used / data.quota.max) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-4 w-[120px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 