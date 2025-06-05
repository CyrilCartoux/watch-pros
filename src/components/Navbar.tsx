'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, Bell, LogOut, Heart, MessageSquare, LayoutDashboard, MoreHorizontal } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "./ui/badge"
import { SearchBar } from "./SearchBar"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navigation = [
  { name: "Brands", href: "/brands" },
  { name: "Listings", href: "/listings" },
  { name: "Sellers", href: "/sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications/count')
        if (!response.ok) throw new Error('Failed to fetch unread count')
        const data = await response.json()
        setUnreadNotifications(data.count)
      } catch (err) {
        console.error('Error fetching unread notifications count:', err)
      }
    }

    if (user) {
      fetchUnreadCount()
    }
  }, [user])

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

          {/* Account */}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=messages" className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=favorites" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="flex items-center">
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        More
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Login / Signup
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
        <div className="md:hidden shadow-lg" ref={menuRef}>
          <div className="container space-y-3 py-3 bg-background">
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
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                    <Link href="/account?tab=dashboard" onClick={handleLinkClick} className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                    <Link href="/account?tab=messages" onClick={handleLinkClick} className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Messages
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                    <Link href="/account?tab=favorites" onClick={handleLinkClick} className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Favorites
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                    <Link href="/account" onClick={handleLinkClick} className="flex items-center gap-2">
                      <MoreHorizontal className="h-4 w-4" />
                      More
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start h-9 text-red-600 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      signOut()
                      handleLinkClick()
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                  <Link href="/auth" onClick={handleLinkClick} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Login / Signup
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 