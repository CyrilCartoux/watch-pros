"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Pause, Play, Edit, Trash2, Plus, CheckCircle2, DollarSign } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MyListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const [declareSaleDialogOpen, setDeclareSaleDialogOpen] = useState(false)
  const [listingToDeclareSale, setListingToDeclareSale] = useState<string | null>(null)
  const [finalPrice, setFinalPrice] = useState("")
  const [isSubmittingSale, setIsSubmittingSale] = useState(false)
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    setLoading(true)
    fetch(`/api/listings/me?page=${currentPage}&limit=${itemsPerPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setListings(data.listings)
          setTotalPages(data.totalPages)
        }
      })
      .catch(err => {
        setError('Failed to fetch listings')
        console.error('Error fetching listings:', err)
      })
      .finally(() => setLoading(false))
  }, [currentPage])

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

  const openDeclareSaleDialog = (id: string) => {
    setListingToDeclareSale(id)
    setDeclareSaleDialogOpen(true)
  }

  const handleDeclareSale = async () => {
    if (!listingToDeclareSale) return

    setIsSubmittingSale(true)
    try {
      const response = await fetch(`/api/listings/${listingToDeclareSale}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finalPrice: finalPrice ? parseFloat(finalPrice) : null,
          sold_at: new Date().toISOString()
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to declare sale")
      }

      setListings(listings => listings.map(l => 
        l.id === listingToDeclareSale ? { ...l, status: "sold" } : l
      ))
      
      toast({
        title: "Sale declared",
        description: "The listing has been marked as sold",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to declare sale"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingSale(false)
      setDeclareSaleDialogOpen(false)
      setListingToDeclareSale(null)
      setFinalPrice("")
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )

  if (error) {
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
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">
              {error === "Seller not found" 
                ? "You need to complete your seller profile before creating listings."
                : "An error occurred while loading your listings."}
            </p>
            {error === "Seller not found" ? (
              <Link href="/account/seller">
                <Button size="sm">
                  Complete your seller profile
                </Button>
              </Link>
            ) : (
              <Button size="sm" onClick={() => window.location.reload()}>
                Try again
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

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
                  {listing.status === "active" ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 h-7 md:h-8 text-xs"
                        onClick={() => handlePause(listing.id)}
                      >
                        <Pause className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Pause</span>
                      </Button>
                      <Link href={`/sell/${listing.type}/${listing.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-7 md:h-8 text-xs">
                          <Edit className="h-3 w-3 md:mr-1" />
                          <span className="hidden md:inline">Edit</span>
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 h-7 md:h-8 text-xs"
                        onClick={() => openDeleteDialog(listing.id)}
                      >
                        <Trash2 className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Delete</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 h-7 md:h-8 text-xs"
                        onClick={() => handlePause(listing.id)}
                      >
                        <Play className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Activate</span>
                      </Button>
                      <Link href={`/sell/${listing.type}/${listing.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-7 md:h-8 text-xs">
                          <Edit className="h-3 w-3 md:mr-1" />
                          <span className="hidden md:inline">Edit</span>
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="flex-1 h-7 md:h-8 text-xs"
                        onClick={() => openDeleteDialog(listing.id)}
                      >
                        <Trash2 className="h-3 w-3 md:mr-1" />
                        <span className="hidden md:inline">Delete</span>
                      </Button>
                    </>
                  )}
                </div>
                {listing.status === "active" ? (
                  <Button 
                    className="w-full h-9 md:h-10 text-sm bg-green-600 hover:bg-green-700 mt-2"
                    onClick={() => openDeclareSaleDialog(listing.id)}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Declare Sale
                  </Button>
                ) : listing.status === "sold" ? (
                  <Button 
                    className="w-full h-9 md:h-10 text-sm bg-green-600 mt-2"
                    disabled
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Sold
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {/* First page */}
            {currentPage > 3 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </Button>
                {currentPage > 4 && <span className="px-2">...</span>}
              </>
            )}

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>

          {/* Page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Go to page:</span>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => setCurrentPage(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Page" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <SelectItem key={page} value={page.toString()}>
                    {page}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              of {totalPages}
            </span>
          </div>
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

      <Dialog open={declareSaleDialogOpen} onOpenChange={setDeclareSaleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Declare Sale</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this listing as sold? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="finalPrice">Final Sale Price (Optional)</Label>
              <Input
                id="finalPrice"
                type="number"
                placeholder="Enter final sale price"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This information is used for statistics and market analysis.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeclareSaleDialogOpen(false)
                setListingToDeclareSale(null)
                setFinalPrice("")
              }}
              disabled={isSubmittingSale}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleDeclareSale}
              disabled={isSubmittingSale}
            >
              {isSubmittingSale ? "Declaring..." : "Confirm Sale"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 