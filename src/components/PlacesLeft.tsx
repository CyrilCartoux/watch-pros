"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Crown} from "lucide-react"

interface PlacesLeftData {
  activeSubscriptions: number
  totalSpots: number
  remainingSpots: number
}

export function PlacesLeft() {
  const [data, setData] = useState<PlacesLeftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlacesLeft()
  }, [])

  const fetchPlacesLeft = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscriptions/places-left')
      
      if (!response.ok) {
        throw new Error('Failed to fetch places left data')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error fetching places left:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-4 h-4 bg-muted animate-pulse rounded" />
        <span>Loading...</span>
      </div>
    )
  }

  if (error || !data) {
    return null // Don't show anything if there's an error
  }

  const percentageUsed = Math.round((data.activeSubscriptions / data.totalSpots) * 100)
  const isLowSpots = data.remainingSpots <= 10

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center w-full space-y-2 sm:space-y-0 sm:gap-3 text-sm">
      {/* Badge + headline */}
      <div className="flex flex-col items-center sm:items-start">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-3 py-1.5 text-xs border-0 shadow-lg mb-1">
          <Crown className="h-3 w-3 mr-1" />
          PIONEER OFFER
        </Badge>
        <span className="text-xs text-amber-700 font-semibold text-center sm:text-left">Founding offer: only {data.remainingSpots} spots left at reduced price</span>
      </div>
      {/* Active Subscriptions */}
      <div className="flex items-center gap-1.5">
        <Users className="w-4 h-4 text-primary" />
        <span className="font-medium">{data.activeSubscriptions}</span>
        <span className="text-muted-foreground">active</span>
      </div>
      {/* Separator (desktop only) */}
      <div className="hidden sm:block w-px h-4 bg-border" />
      {/* Remaining Spots */}
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="font-medium">{data.remainingSpots}</span>
        <span className="text-muted-foreground">spots left</span>
        {isLowSpots && (
          <Badge variant="destructive" className="ml-1 text-xs">
            Limited
          </Badge>
        )}
      </div>
      {/* Progress Bar (desktop only) */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-8">
          {percentageUsed}%
        </span>
      </div>
      {/* FOMO message */}
      <div className="w-full text-center mt-1">
        <span className="text-xs text-amber-700 font-medium">Become a founding member and lock in the lowest price forever!</span>
      </div>
    </div>
  )
} 