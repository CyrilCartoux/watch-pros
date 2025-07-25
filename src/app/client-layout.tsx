'use client'

import { AuthProvider } from "@/contexts/AuthContext"
import { BrandsAndModelsProvider } from "@/contexts/BrandsAndModelsContext"
import { NotificationsProvider } from "@/contexts/NotificationsContext"
import { MessagesProvider } from "@/contexts/MessagesContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Toaster } from "@/components/ui/toaster"
import { MobileBottomNav } from "@/components/MobileBottomNav"
import LogRocketProvider from "@/components/LogRocketProvider"
import PWAInstaller from "@/components/PWAInstaller"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <LogRocketProvider />
      <NotificationsProvider>
        <MessagesProvider>
          <BrandsAndModelsProvider>
            <div className="flex flex-col min-h-screen">
              <PWAInstaller />
              <Navbar />
              <main className="flex-grow pb-16 md:pb-0">{children}</main>
              <Footer />
            </div>
            <MobileBottomNav />
            <Toaster />
          </BrandsAndModelsProvider>
        </MessagesProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}
