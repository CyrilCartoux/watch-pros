'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, User, Bell, LogOut, Heart, MessageSquare, LayoutDashboard, MoreHorizontal, Tag, Shield, List } from "lucide-react"
import { useState, useRef } from "react"
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
import { useAuthStatus } from "@/hooks/useAuthStatus"

const navigation = [
  { name: "Brands", href: "/brands" },
  { name: "Listings", href: "/listings" },
  { name: "Sellers", href: "/sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const { user, signOut } = useAuth()
  const { 
    isAuthenticated, 
    isSeller, 
    isVerified, 
    hasActiveSubscription, 
    isAdmin,
    isLoading 
  } = useAuthStatus()
  const { unreadCount } = useNotifications()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Show navigation only if user is authenticated, verified, and has active subscription
  const showNavigation = isAuthenticated && isVerified && hasActiveSubscription

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Left side: Logo + Nav Links */}
        <div className="mr-4 hidden items-center md:flex">
          <Link href="/listings?listingType=watch" className="mr-6 text-xl font-bold">
            Watch Pros®
          </Link>
          {showNavigation && (
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
              {isAdmin && (
                <Link
                  href="/admin"
                  className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Mobile Logo */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2 text-2xl sm:text-3xl font-extrabold">
            Watch Pros®
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">

          {/* Right side for desktop */}
          <div className="hidden items-center space-x-2 md:flex">
            {showNavigation && (
              <>
                <Button asChild>
                  <Link href="/sell">Sell a Watch</Link>
                </Button>
                <Button asChild>
                  <Link href="/searches">Search for a Watch</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <User className="h-4 w-4" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {showNavigation && (
                    <>
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
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account?tab=settings" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {!isVerified && (
                    <DropdownMenuItem asChild>
                      <Link href="/register/pending" className="flex items-center text-yellow-600">
                        <Shield className="mr-2 h-4 w-4" />
                        Pending Verification
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {!hasActiveSubscription && (
                    <DropdownMenuItem asChild>
                      <Link href="/subscription" className="flex items-center text-blue-600">
                        <Tag className="mr-2 h-4 w-4" />
                        Subscribe
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={e => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden shadow-lg" ref={menuRef} onClick={e => e.stopPropagation()}>
          <div className="container py-4 bg-background flex flex-col gap-4">
            {isAuthenticated && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground truncate text-center">
                {user?.email}
              </div>
            )}
            {/* Actions principales - seulement si navigation autorisée */}
            {showNavigation && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Link href="/sell" onClick={handleLinkClick} className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Sell</span>
                </Link>
                <Link href="/searches" onClick={handleLinkClick} className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">Search</span>
                </Link>
              </div>
            )}
            {/* Navigation principale - seulement si navigation autorisée */}
            {showNavigation && (
              <div className="grid grid-cols-3 gap-2">
                <Link href="/listings?listingType=watch" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                  <Tag className="h-5 w-5" />
                  <span className="text-xs">Watches</span>
                </Link>
                <Link href="/listings?listingType=accessory" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                  <Tag className="h-5 w-5" />
                  <span className="text-xs">Accessories</span>
                </Link>
                <Link href="/searches" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs">Searches</span>
                </Link>
                <Link href="/sellers" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Sellers</span>
                </Link>
                <Link href="/brands" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                  <Shield className="h-5 w-5" />
                  <span className="text-xs">Brands</span>
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-3 rounded-lg hover:bg-muted transition">
                    <Shield className="h-5 w-5 text-red-500" />
                    <span className="text-xs text-red-600 font-semibold">Admin</span>
                  </Link>
                )}
              </div>
            )}
            {/* Section compte */}
            <div className="border-t pt-3 mt-2">
              {isAuthenticated ? (
                <div className="grid grid-cols-3 gap-2">
                  {showNavigation && (
                    <>
                      <Link href="/account?tab=dashboard" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="text-xs">Dashboard</span>
                      </Link>
                      <Link href="/account?tab=listings" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                        <Tag className="h-5 w-5" />
                        <span className="text-xs">Listings</span>
                      </Link>
                      <Link href="/account?tab=messages" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                        <List className="h-5 w-5" />
                        <span className="text-xs">Sales</span>
                      </Link>
                      <Link href="/account?tab=favorites" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                        <Heart className="h-5 w-5" />
                        <span className="text-xs">Favorites</span>
                      </Link>
                    </>
                  )}
                  <Link href="/account?tab=settings" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                    <User className="h-5 w-5" />
                    <span className="text-xs">Settings</span>
                  </Link>
                  {!isVerified && (
                    <Link href="/register/pending" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-yellow-50 transition text-yellow-600">
                      <Shield className="h-5 w-5" />
                      <span className="text-xs">Pending</span>
                    </Link>
                  )}
                  {!hasActiveSubscription && (
                    <Link href="/subscription" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-blue-50 transition text-blue-600">
                      <Tag className="h-5 w-5" />
                      <span className="text-xs">Subscribe</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); handleLinkClick(); }}
                    className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-red-50 transition text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="text-xs">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/auth" onClick={handleLinkClick} className="flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-muted transition">
                    <User className="h-5 w-5" />
                    <span className="text-xs">Login</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 