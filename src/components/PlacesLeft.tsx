"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Crown } from "lucide-react"

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
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-6 animate-pulse">
        <div className="w-10 h-10 bg-muted rounded-full mb-2" />
        <span className="text-muted-foreground text-sm">Loading places...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-6">
        <span className="text-destructive text-sm font-medium">{error || "Unknown error"}</span>
      </div>
    )
  }

  const percentageUsed = Math.round((data.activeSubscriptions / data.totalSpots) * 100)
  const isLowSpots = data.remainingSpots <= 10

  return (
    <section className="w-full max-w-xl mx-auto rounded-xl border bg-background shadow-lg px-6 py-5 flex flex-col gap-4 items-center">
      {/* Header badge */}
      <div className="flex items-center gap-2 mb-1">
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-4 py-2 text-sm border-0 shadow">
          <Crown className="h-4 w-4 mr-2 -ml-1" />
          PIONEER OFFER
        </Badge>
        {isLowSpots && (
          <Badge variant="destructive" className="text-xs px-2 py-1 animate-bounce">Only {data.remainingSpots} spots left!</Badge>
        )}
      </div>
      {/* Places left big number */}
      <div className="flex flex-col items-center">
        <span className="text-4xl font-extrabold text-amber-600 flex items-center gap-2">
          <Clock className="w-7 h-7 text-amber-500" />
          {data.remainingSpots}
        </span>
        <span className="text-sm text-muted-foreground font-medium mt-1">spots at reduced price</span>
      </div>
      {/* Progress bar */}
      <div className="w-full flex flex-col items-center gap-1">
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
            style={{ width: `${percentageUsed}%` }}
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white font-bold drop-shadow">
            {percentageUsed}%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{data.activeSubscriptions} active subscribers / {data.totalSpots} total spots</span>
      </div>
      {/* FOMO message */}
      <div className="w-full text-center mt-2">
        <span className="text-sm text-amber-700 font-semibold">Become a founding member and lock in this price forever!</span>
      </div>
    </section>
  )
} 