'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart, User, Bell } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "./ui/badge"
import { SearchBar } from "./SearchBar"

const navigation = [
  { name: "Brands", href: "/brands" },
  { name: "Listings", href: "/listings" },
  { name: "Sellers", href: "/sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  // TODO: Replace with real unread notifications counter
  const unreadNotifications = 3

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 sm:h-16 items-center justify-between">
        {/* Logo */}
        <div className="mr-4 sm:mr-8">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            Watch Pros
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          {/* Main Navigation */}
          <div className="flex items-center gap-4 lg:gap-6">
            <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
              <Link href="/listings">Buy</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
              <Link href="/sell">Sell</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
              <Link href="/sellers">Sellers</Link>
            </Button>
            <SearchBar className="w-64 lg:w-96" />
          </div>

          {/* Account & Cart */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/notifications" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
              <Link href="/account">
                <User className="h-4 w-4" />
                <span className="sr-only">My Account</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" ref={menuRef}>
          <div className="container space-y-3 py-3">
            <SearchBar />
            <div className="flex flex-col gap-1">
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/listings" onClick={handleLinkClick}>Buy</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/sell" onClick={handleLinkClick}>Sell</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/sellers" onClick={handleLinkClick}>View Sellers</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-1 pt-3 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/notifications" onClick={handleLinkClick} className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <Badge variant="destructive" className="ml-auto text-[10px]">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/cart" onClick={handleLinkClick} className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/account" onClick={handleLinkClick} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 