"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Pause, Play, Edit, Trash2, Plus, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { watchConditions } from "@/data/watch-conditions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function MyListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetch("/api/listings/me")
      .then(res => res.json())
      .then(data => setListings(data))
      .finally(() => setLoading(false))
  }, [])

  const handlePause = async (id: string) => {
    await fetch(`/api/listings/${id}/toggle-status`, { method: "POST" })
    setListings(listings => listings.map(l => l.id === id ? { ...l, status: l.status === "active" ? "paused" : "active" } : l))
  }

  const openDeleteDialog = (id: string) => {
    setListingToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!listingToDelete) return

    try {
      await fetch(`/api/listings/${listingToDelete}`, { method: "DELETE" })
      setListings(listings => listings.filter(l => l.id !== listingToDelete))
      
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setListingToDelete(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Listings</h2>
        <Link href="/sell">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
            <Link href="/sell">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create your first listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative aspect-[3/4]">
                {listing.image ? (
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No image</span>
                  </div>
                )}
                <Badge 
                  variant={listing.status === "active" ? "default" : "secondary"}
                  className="absolute top-2 right-2 text-[10px]"
                >
                  {listing.status}
                </Badge>
              </div>
              <CardContent className="p-2 md:p-3 space-y-1.5 md:space-y-2">
                <div>
                  <h3 className="font-semibold text-xs md:text-sm line-clamp-1">{listing.title}</h3>
                  <p className="text-base md:text-lg font-bold text-primary">
                    {listing.price.toLocaleString()} €
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {listing.brand && (
                    <Badge variant="outline" className="text-[10px] md:text-xs">{listing.brand}</Badge>
                  )}
                  {listing.model && (
                    <Badge variant="outline" className="text-[10px] md:text-xs">{listing.model}</Badge>
                  )}
                </div>
                <div className="flex gap-1 pt-1">
                  <Link href={`/sell/${listing.type}/${listing.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-7 md:h-8 text-xs">
                      <Edit className="h-3 w-3 md:mr-1" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 h-7 md:h-8 text-xs"
                    onClick={() => handlePause(listing.id)}
                  >
                    {listing.status === "active" ? (
                      <>
                        <Pause className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Activate</span>
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="flex-1 h-7 md:h-8 text-xs"
                    onClick={() => openDeleteDialog(listing.id)}
                  >
                    <Trash2 className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 