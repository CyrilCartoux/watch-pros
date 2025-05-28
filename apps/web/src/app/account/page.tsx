"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, MessageSquare, Star, Heart, ShoppingBag, Settings } from "lucide-react"
import { DashboardTab } from "@/components/account/DashboardTab"
import { MessagesTab } from "@/components/account/MessagesTab"
import { ReviewsTab } from "@/components/account/ReviewsTab"
import { FavoritesTab } from "@/components/account/FavoritesTab"
import { SalesTab } from "@/components/account/SalesTab"
import { SettingsTab } from "@/components/account/SettingsTab"

export default function AccountPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Mon compte</h1>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messagerie
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Avis
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favoris
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Ventes
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <DashboardTab />
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="h-[calc(100vh-12rem)]">
          <MessagesTab />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <FavoritesTab />
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <SalesTab />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
} 