'use client'

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { Toaster } from "@/components/ui/toaster"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
      <Footer />
      <Toaster />
    </AuthProvider>
  )
}
