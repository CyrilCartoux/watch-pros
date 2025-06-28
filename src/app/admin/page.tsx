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
  Shield,
  ChevronDown,
  ChevronUp
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      <div className="container px-4 py-6 sm:py-8">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">Error</h2>
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
    <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header - Mobile Optimized */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Monitor your platform's performance and user activity
            </p>
          </div>
          
          {/* Mobile Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchDashboardData} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics - Mobile Optimized Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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

      {/* Charts Section - Mobile Optimized Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        {/* Mobile Optimized TabsList */}
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="brands" className="text-xs sm:text-sm px-2 py-2">
              Brands
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm px-2 py-2">
              Pending
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Time Series Chart - Mobile Optimized */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">Activity Over Time</CardTitle>
                  <CardDescription className="text-sm">Track platform activity trends</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-full sm:w-32 text-sm">
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
                    <SelectTrigger className="w-full sm:w-24 text-sm">
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
            <CardContent className="pt-0">
              <div className="h-64 sm:h-80">
                <LineChart data={timeSeriesData} metric={selectedMetric} />
              </div>
            </CardContent>
          </Card>

          {/* Distribution Charts - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Listings Status</CardTitle>
                <CardDescription className="text-sm">Distribution of listing statuses</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-48 sm:h-64">
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
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Offers Status</CardTitle>
                <CardDescription className="text-sm">Distribution of offer responses</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-48 sm:h-64">
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

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          {/* Detailed Analytics - Mobile Optimized Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Pricing Analytics - Mobile Optimized */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Pricing Analytics</CardTitle>
              <CardDescription className="text-sm">Price distribution and trends</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.avg_price)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Average Price</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.median_price)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Median Price</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(stats.pricing.total_gmv)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total GMV</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-4 sm:space-y-6">
          {brandsModels && (
            <>
              {/* Top Brands - Mobile Optimized */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Top 10 Brands</CardTitle>
                  <CardDescription className="text-sm">Most listed brands by volume</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64 sm:h-80">
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

              {/* Top Models - Mobile Optimized */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl">Top 10 Models</CardTitle>
                  <CardDescription className="text-sm">Most listed models by volume</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-64 sm:h-80">
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

        <TabsContent value="pending" className="space-y-4 sm:space-y-6">
          <PendingIdentitiesTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Metric Card Component - Mobile Optimized
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-xs sm:text-sm font-medium truncate">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="text-lg sm:text-2xl font-bold truncate">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        {change > 0 && (
          <div className="flex items-center text-xs text-green-600 mt-2">
            <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">+{change} this period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Analytics Card Component - Mobile Optimized
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-xs sm:text-sm font-medium truncate">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-muted-foreground truncate">{metric.label}</span>
              <span className="text-xs sm:text-sm font-medium truncate ml-2">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton - Mobile Optimized
function DashboardSkeleton() {
  return (
    <div className="container px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-6 sm:h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Skeleton className="h-6 sm:h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="pt-0">
          <Skeleton className="h-64 sm:h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}