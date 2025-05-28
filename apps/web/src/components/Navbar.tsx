'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Search, ShoppingCart, User, Bell } from "lucide-react"
import { useState } from "react"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"

const navigation = [
  { name: "Brands", href: "/brands" },
  { name: "Listings", href: "/listings" },
  { name: "Sellers", href: "/sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // TODO: Remplacer par un vrai compteur de notifications non lues
  const unreadNotifications = 3

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="mr-8">
          <Link href="/" className="text-2xl font-bold">
            Watch Pros
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          {/* Main Navigation */}
          <div className="flex items-center gap-6">
            <Button variant="ghost" asChild>
              <Link href="/listings">Acheter</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sell">Vendre</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/sellers">Voir les vendeurs</Link>
            </Button>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une montre..."
                className="pl-10 h-11 text-base"
              />
            </div>
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Panier</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/account">
                <User className="h-5 w-5" />
                <span className="sr-only">Mon compte</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative"
          >
            <Menu className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="container space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher une montre..."
                className="pl-10 h-11 text-base"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/listings">Acheter</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/sell">Vendre</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/sellers">Voir les vendeurs</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/notifications" className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/cart" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Panier
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/account" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Mon compte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 