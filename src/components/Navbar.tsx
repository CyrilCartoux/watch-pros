'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, Bell, LogOut, Heart, MessageSquare, LayoutDashboard, MoreHorizontal, Tag } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "./ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationsContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const navigation = [
  { name: "Brands", href: "/brands" },
  { name: "Listings", href: "/listings" },
  { name: "Sellers", href: "/sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const { unreadCount } = useNotifications()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
      <div className="container flex h-14 items-center">
        {/* Left side: Logo + Nav Links */}
        <div className="mr-4 hidden items-center md:flex">
          <Link href="/listings?listingType=watch" className="mr-6 text-xl font-bold">
            Watch Pros
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/listings?listingType=watch"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Watches
            </Link>
            <Link
              href="/listings?listingType=accessory"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Accessories
            </Link>
            
            <Link
              href="/searches"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Searches
            </Link>

            <Link
              href="/sellers"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Sellers
            </Link>
            <Link
              href="/brands"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Brands
            </Link>
          </nav>
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2 text-2xl sm:text-3xl font-extrabold">
            Watch Pros
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">

          {/* Right side for desktop */}
          <div className="hidden items-center space-x-2 md:flex">
            <Button asChild>
              <Link href="/sell">Sell a Watch</Link>
            </Button>
            <Button asChild>
              <Link href="/searches">Search for a Watch</Link>
            </Button>
            {user && (
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link href="/notifications" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
            )}
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
                    <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account?tab=listings" className="flex items-center">
                        <Tag className="mr-2 h-4 w-4" />
                        My Listings
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
                      <Link href="/account?tab=settings" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Settings
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

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden shadow-lg" ref={menuRef}>
          <div className="container space-y-3 py-3 bg-background">
            {user && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                {user.email}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <Button asChild className="w-full mb-2">
                <Link href="/sell" onClick={handleLinkClick}>Sell a Watch</Link>
              </Button>
              <Button asChild className="w-full mb-2">
                <Link href="/searches" onClick={handleLinkClick}>Search for a Watch</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/listings?listingType=watch" onClick={handleLinkClick}>Watches</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/listings?listingType=accessory" onClick={handleLinkClick}>Accessories</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/searches" onClick={handleLinkClick}>Searches</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/sellers" onClick={handleLinkClick}>Sellers</Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                <Link href="/brands" onClick={handleLinkClick}>Brands</Link>
              </Button>
            </div>
            {user ? (
              <div className="flex flex-col gap-1 pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                  <Link href="/account?tab=dashboard" onClick={handleLinkClick} className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                  <Link href="/account?tab=listings" onClick={handleLinkClick} className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    My Listings
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
                  <Link href="/account?tab=settings" onClick={handleLinkClick} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Settings
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
              </div>
            ) : (
              <div className="flex flex-col gap-1 pt-3 border-t">
                <Button variant="ghost" size="sm" className="w-full justify-start h-9" asChild>
                  <Link href="/auth" onClick={handleLinkClick} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Login / Signup
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
} 