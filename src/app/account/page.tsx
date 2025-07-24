"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, MessageSquare, Star, Heart, ShoppingBag, Settings, MoreHorizontal, List, Search } from "lucide-react"
import { DashboardTab } from "@/components/account/DashboardTab"
import { MessagesTab } from "@/components/account/MessagesTab"
import { ReviewsTab } from "@/components/account/ReviewsTab"
import { FavoritesTab } from "@/components/account/FavoritesTab"
import { SalesTab } from "@/components/account/SalesTab"
import { SettingsTab } from "@/components/account/SettingsTab"
import { ActiveSearchesTab } from "@/components/account/ActiveSearchesTab"
import MyListings from "@/components/account/MyListings"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AccountPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') || 'dashboard'

  const handleTabChange = (value: string) => {
    router.push(`/account?tab=${value}`)
  }

  return (
    <div className="container py-4 md:py-8">
      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4 md:space-y-6">
        {/* Mobile Tabs - grid 2x4, tous visibles, DS friendly */}
        <div className="md:hidden grid grid-cols-4 gap-2 pb-2">
          <Button
            variant={tab === 'dashboard' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('dashboard')}
          >
            <BarChart className="h-5 w-5 mb-1" />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            variant={tab === 'listings' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('listings')}
          >
            <ShoppingBag className="h-5 w-5 mb-1" />
            <span className="text-xs">Listings</span>
          </Button>
          <Button
            variant={tab === 'searches' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('searches')}
          >
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs">Searches</span>
          </Button>
          <Button
            variant={tab === 'favorites' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('favorites')}
          >
            <Heart className="h-5 w-5 mb-1" />
            <span className="text-xs">Favorites</span>
          </Button>
          <Button
            variant={tab === 'messages' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('messages')}
          >
            <MessageSquare className="h-5 w-5 mb-1" />
            <span className="text-xs">Messages</span>
          </Button>
          <Button
            variant={tab === 'reviews' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('reviews')}
          >
            <Star className="h-5 w-5 mb-1" />
            <span className="text-xs">Reviews</span>
          </Button>
          <Button
            variant={tab === 'sales' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('sales')}
          >
            <List className="h-5 w-5 mb-1" />
            <span className="text-xs">Sales</span>
          </Button>
          <Button
            variant={tab === 'settings' ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col items-center justify-center py-3"
            onClick={() => handleTabChange('settings')}
          >
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Searches
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <DashboardTab />
        </TabsContent>

        <TabsContent value="listings" className="space-y-6">
          <MyListings />
        </TabsContent>

        <TabsContent value="searches" className="space-y-6">
          <ActiveSearchesTab />
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <FavoritesTab />
        </TabsContent>

        <TabsContent value="messages" className="h-[calc(100vh-12rem)]">
          <MessagesTab />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <ReviewsTab />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <SalesTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}