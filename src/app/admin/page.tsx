"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Users,
  Tag,
  MessageSquare,
  Bell,
  Heart,
  Mail,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  Search,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Shield
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { PendingIdentitiesTab } from "@/components/admin/PendingIdentitiesTab"

// Dynamically import charts to avoid SSR issues
const LineChart = dynamic(() => import("@/components/admin/LineChart"), { ssr: false })
const BarChart = dynamic(() => import("@/components/admin/BarChart"), { ssr: false })
const PieChart = dynamic(() => import("@/components/admin/PieChart"), { ssr: false })

interface DashboardStats {
  users: {
    total: number
    new_period: number
    admins: number
    regular: number
  }
  subscriptions: {
    active: number
    trialing: number
    canceled: number
    new_period: number
  }
  listings: {
    total: number
    active: number
    sold: number
    draft: number
    new_period: number
    sold_period: number
  }
  messages: {
    total: number
    new_period: number
  }
  custom_alerts: {
    total: number
    new_period: number
    avg_per_user: number
  }
  favorites: {
    total: number
    new_period: number
  }
  newsletter: {
    active_subscribers: number
    new_period: number
  }
  offers: {
    total: number
    accepted: number
    rejected: number
    pending: number
    new_period: number
  }
  reviews: {
    total: number
    new_period: number
    avg_rating: number
  }
  pricing: {
    avg_price: number
    median_price: number
    total_gmv: number
  }
  sales_rate: number
  active_searches: {
    active_count: number
    new_period: number
  }
}

interface BrandsModelsData {
  top_brands: Array<{
    brand_name: string
    brand_slug: string
    listing_count: number
    sold_count: number
    avg_price: number
    total_value: number
  }>
  top_models: Array<{
    model_name: string
    model_slug: string
    brand_name: string
    listing_count: number
    sold_count: number
    avg_price: number
    total_value: number
  }>
}

interface TimeSeriesData {
  period: string
  count: number
  sold_count?: number
  avg_price?: number
  accepted_count?: number
  rejected_count?: number
  avg_rating?: number
}

export default function AdminDashboard()  {
const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [brandsModels, setBrandsModels] = useState<BrandsModelsData | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedMetric, setSelectedMetric] = useState("listings")
  const [selectedChartPeriod, setSelectedChartPeriod] = useState("month")

  useEffect(() => {
    // Attendre que l'authentification soit chargée
    if (!authLoading) {
      if (user) {
        checkAdminRole()
      } else {
        router.push("/auth")
      }
    }
  }, [user, authLoading])

  const checkAdminRole = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.status === 403) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page",
          variant: "destructive",
        })
        router.push("/")
        return
      }
      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error checking admin role:", error)
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsResponse, brandsResponse] = await Promise.all([
        fetch(`/api/admin/dashboard?period=${selectedPeriod}`),
        fetch("/api/admin/dashboard")
      ])

      if (statsResponse.ok && brandsResponse.ok) {
        const statsData = await statsResponse.json()
        const brandsData = await brandsResponse.json()
        
        setStats(statsData.stats)
        setBrandsModels(brandsData.brandsModels)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await fetch(`/api/admin/charts?metric=${selectedMetric}&period=${selectedChartPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setTimeSeriesData(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching chart data:", error)
    }
  }

  useEffect(() => {
    if (stats) {
      fetchChartData()
    }
  }, [selectedMetric, selectedChartPeriod, stats])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!stats) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your platform's performance and user activity
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={formatNumber(stats.users.total)}
          change={stats.users.new_period}
          icon={Users}
          description="Registered users"
        />
        <MetricCard
          title="Active Listings"
          value={formatNumber(stats.listings.active)}
          change={stats.listings.new_period}
          icon={Tag}
          description="Currently active"
        />
        <MetricCard
          title="Total GMV"
          value={formatCurrency(stats.pricing.total_gmv)}
          change={stats.listings.sold_period}
          icon={DollarSign}
          description="Gross Merchandise Value"
        />
        <MetricCard
          title="Sales Rate"
          value={`${stats.sales_rate}%`}
          change={stats.listings.sold_period}
          icon={TrendingUp}
          description="Conversion rate"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="brands">Brands & Models</TabsTrigger>
          <TabsTrigger value="pending">Pending Identities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Over Time</CardTitle>
                  <CardDescription>Track platform activity trends</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="listings">Listings</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                      <SelectItem value="reviews">Reviews</SelectItem>
                      <SelectItem value="offers">Offers</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedChartPeriod} onValueChange={setSelectedChartPeriod}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart data={timeSeriesData} metric={selectedMetric} />
              </div>
            </CardContent>
          </Card>

          {/* Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Listings Status</CardTitle>
                <CardDescription>Distribution of listing statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart
                    data={[
                      { name: 'Active', value: stats.listings.active, color: '#10b981' },
                      { name: 'Sold', value: stats.listings.sold, color: '#3b82f6' },
                      { name: 'Hold', value: stats.listings.draft, color: '#f59e0b' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Offers Status</CardTitle>
                <CardDescription>Distribution of offer responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart
                    data={[
                      { name: 'Accepted', value: stats.offers.accepted, color: '#10b981' },
                      { name: 'Rejected', value: stats.offers.rejected, color: '#ef4444' },
                      { name: 'Pending', value: stats.offers.pending, color: '#f59e0b' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnalyticsCard
              title="User Engagement"
              metrics={[
                { label: "Messages Sent", value: formatNumber(stats.messages.total) },
                { label: "Favorites Added", value: formatNumber(stats.favorites.total) },
                { label: "Custom Alerts", value: formatNumber(stats.custom_alerts.total) },
                { label: "Active Searches", value: formatNumber(stats.active_searches.active_count) },
              ]}
              icon={BarChart3}
            />
            
            <AnalyticsCard
              title="Subscription Metrics"
              metrics={[
                { label: "Active Subscriptions", value: formatNumber(stats.subscriptions.active) },
                { label: "Trial Subscriptions", value: formatNumber(stats.subscriptions.trialing) },
                { label: "Canceled Subscriptions", value: formatNumber(stats.subscriptions.canceled) },
                { label: "New This Period", value: formatNumber(stats.subscriptions.new_period) },
              ]}
              icon={TrendingUp}
            />
            
            <AnalyticsCard
              title="Content & Reviews"
              metrics={[
                { label: "Total Reviews", value: formatNumber(stats.reviews.total) },
                { label: "Average Rating", value: `${stats.reviews.avg_rating}/5` },
                { label: "Newsletter Subscribers", value: formatNumber(stats.newsletter.active_subscribers) },
                { label: "New Reviews", value: formatNumber(stats.reviews.new_period) },
              ]}
              icon={Star}
            />
          </div>

          {/* Pricing Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analytics</CardTitle>
              <CardDescription>Price distribution and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.avg_price)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.median_price)}
                  </div>
                  <div className="text-sm text-muted-foreground">Median Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.total_gmv)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total GMV</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-6">
          {brandsModels && (
            <>
              {/* Top Brands */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Brands</CardTitle>
                  <CardDescription>Most listed brands by volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart
                      data={brandsModels.top_brands.map(brand => ({
                        name: brand.brand_name,
                        listings: brand.listing_count,
                        sold: brand.sold_count,
                        avgPrice: brand.avg_price,
                      }))}
                      type="brands"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Top Models */}
              <Card>
                <CardHeader>
                  <CardTitle>Top 10 Models</CardTitle>
                  <CardDescription>Most listed models by volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <BarChart
                      data={brandsModels.top_models.map(model => ({
                        name: `${model.brand_name} ${model.model_name}`,
                        listings: model.listing_count,
                        sold: model.sold_count,
                        avgPrice: model.avg_price,
                      }))}
                      type="models"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <PendingIdentitiesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Metric Card Component
function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  description 
}: {
  title: string
  value: string
  change: number
  icon: any
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change > 0 && (
          <div className="flex items-center text-xs text-green-600 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{change} this period
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Analytics Card Component
function AnalyticsCard({ 
  title, 
  metrics, 
  icon: Icon 
}: {
  title: string
  metrics: Array<{ label: string; value: string }>
  icon: any
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <span className="text-sm font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}