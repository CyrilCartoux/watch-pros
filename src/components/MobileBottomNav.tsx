"use client"

import { Home, MessageCircle, Bell, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useNotifications } from "@/contexts/NotificationsContext"
import { Badge } from "./ui/badge"

const navItems = [
  { href: "/listings", icon: Home, label: "Listings" },
  { href: "/account?tab=messages", icon: MessageCircle, label: "Messages" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/account", icon: User, label: "Account" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { unreadCount } = useNotifications()

  if (!user) {
    return null
  }

  const isActive = (href: string) => {
    if (href.startsWith("/account")) {
      return pathname.startsWith("/account")
    }
    return pathname === href
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted group ${
              isActive(item.href) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5 mb-1" />
              {item.label === "Notifications" && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <span
              className={`text-xs ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
} 