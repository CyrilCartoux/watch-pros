'use client'

import { AuthProvider } from "@/contexts/AuthContext"
import { BrandsAndModelsProvider } from "@/contexts/BrandsAndModelsContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { MobileBottomNav } from "@/components/MobileBottomNav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <BrandsAndModelsProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">{children}</main>
            <Footer />
          </div>
          <MobileBottomNav />
          <Toaster />
        </BrandsAndModelsProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}
