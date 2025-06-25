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

export default function AccountPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get('tab') || 'dashboard'

  const handleTabChange = (value: string) => {
    router.push(`/account?tab=${value}`)
  }

  return (
    <div className="container py-4 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">My Account</h1>

      <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4 md:space-y-6">
        {/* Mobile Tabs */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTabChange("favorites")}>
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("messages")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("reviews")}>
                <Star className="h-4 w-4 mr-2" />
                Reviews
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("sales")}>
                <List className="h-4 w-4 mr-2" />
                Sales
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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