"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Search, Heart, User, MessageSquare, Bell, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationsContext"
import { useMessages } from "@/contexts/MessagesContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import { useState } from "react"

const navItems = [
  { href: "/listings?listingType=watch", icon: Home, label: "Listings" },
  { href: "/account?tab=messages", icon: MessageSquare, label: "Messages" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/account", icon: User, label: "Account" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const { unreadCount: unreadMessagesCount } = useMessages()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)


  if (!user) {
    return null
  }

  const isActive = (href: string) => {
    if (href.startsWith("/account")) {
      return pathname.startsWith("/account")
    }
    return pathname === href
  }

  const handleOptionClick = () => {
    setIsPopoverOpen(false)
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {/* First two nav items */}
        {navItems.slice(0, 2).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted group ${
              isActive(item.href) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.label === "Messages" && unreadMessagesCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 text-[8px]"
                >
                  {unreadMessagesCount}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}

        {/* Center + button with popover */}
        <div className="flex items-center justify-center">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 -mt-6 shadow-lg"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="center" side="top">
              <div className="space-y-1">
                <Link href="/sell/watch" onClick={handleOptionClick}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                  >
                    <span className="mr-2">⌚</span>
                    Watch
                  </Button>
                </Link>
                <Link href="/sell/accessory" onClick={handleOptionClick}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                  >
                    <span className="mr-2">📿</span>
                    Accessory
                  </Button>
                </Link>
                <Link href="/searches" onClick={handleOptionClick}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-10"
                  >
                    <span className="mr-2">🔍</span>
                    Search
                  </Button>
                </Link>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Last two nav items */}
        {navItems.slice(2).map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted group ${
              isActive(item.href) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.label === "Notifications" && unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-3 w-3 flex items-center justify-center p-0 text-[8px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
} 