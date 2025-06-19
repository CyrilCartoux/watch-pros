'use client'

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import LogRocketProvider from "@/components/LogRocketProvider"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LogRocketProvider />
      <Navbar />
      {children}
      <Footer />
      <Toaster />
    </AuthProvider>
  )
}
