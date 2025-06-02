"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, Award, MapPin, Phone, Mail, Globe, Building2, Clock, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { ReviewDialog } from "@/components/ReviewDialog"

interface Seller {
  id: string
  account: {
    companyName: string
    watchProsName: string
    companyStatus: string
    firstName: string
    lastName: string
    email: string
    username: string
    country: string
    title: string
    phonePrefix: string
    phone: string
    language: string
  }
  address: {
    street: string
    city: string
    country: string
    postalCode: string
    website: string
    siren: string
    taxId: string
    vatNumber: string
  } | null
  banking: {
    cardHolder: string
    bankName: string
    paymentMethod: string
  } | null
  listings: {
    id: string
    brand: string
    model: string
    reference: string
    price: number
    currency: string
    image: string
  }[]
}

interface ReviewData {
  rating: number
  comment: string
}

// Mock data for statistics and ratings
const mockStats = {
  totalSales: 156,
  rating: 4.8,
  totalReviews: 42,
  recommendationRate: 98,
  ratings: {
    shipping: 4.9,
    description: 4.8,
    communication: 4.7
  }
}

const mockReviews = [
  {
    id: "1",
    author: "John Smith",
    date: "2024-03-15",
    rating: 5,
    comment: "Excellent service, fast delivery and watch in perfect condition. Highly recommend!",
    verified: true
  },
  {
    id: "2",
    author: "Mary Martin",
    date: "2024-03-10",
    rating: 5,
    comment: "Very professional seller, clear and precise communication. The watch perfectly matches the description.",
    verified: true
  },
  {
    id: "3",
    author: "Peter Durant",
    date: "2024-03-05",
    rating: 4,
    comment: "Very good service, just a small delivery delay but nothing serious. I'm satisfied with my purchase.",
    verified: true
  }
]

const mockFeaturedListings = [
  {
    id: "1",
    brand: "Rolex",
    model: "Submariner",
    reference: "126610LN",
    price: 12500,
    image: "/images/listings/submariner-1.jpg"
  },
  {
    id: "2",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1A",
    price: 85000,
    image: "/images/listings/nautilus-1.jpg"
  },
  {
    id: "3",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    reference: "15500ST",
    price: 45000,
    image: "/images/listings/royal-oak-1.jpg"
  }
]

interface SellerPageProps {
  params: {
    id: string
  }
}

export default function SellerDetailPage({ params }: SellerPageProps) {
  const [currentListing, setCurrentListing] = useState(0)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)
  const [isMessageSuccess, setIsMessageSuccess] = useState(false)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`/api/sellers/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch seller')
        }
        const data = await response.json()
        setSeller(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSeller()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>
            <Skeleton className="w-full md:w-80 h-64" />
          </div>
        </div>
      </main>
    )
  }

  if (error || !seller) {
    return (
      <main className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-muted-foreground">{error || 'Seller not found'}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </main>
    )
  }

  const nextListing = () => {
    if (!seller?.listings.length) return
    setCurrentListing((prev) => 
      prev === seller.listings.length - 1 ? 0 : prev + 1
    )
  }

  const prevListing = () => {
    if (!seller?.listings.length) return
    setCurrentListing((prev) => 
      prev === 0 ? seller.listings.length - 1 : prev - 1
    )
  }

  const handleSubmitMessage = async () => {
    if (!message.trim()) return

    setIsSubmittingMessage(true)
    try {
      // TODO: Submit message to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsMessageSuccess(true)
      setTimeout(() => {
        setIsContactDialogOpen(false)
        setIsMessageSuccess(false)
        setMessage("")
      }, 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  const handleApproveSeller = async () => {
    if (!user || !seller?.id) return

    setIsSubmittingApproval(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setIsApproved(true)
    } catch (error) {
      console.error('Error approving seller:', error)
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  const handleSubmitReview = async (review: ReviewData) => {
    if (!user || !seller?.id) return

    setIsSubmittingReview(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Refresh reviews after submission
      // TODO: Implement refresh reviews logic
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmittingReview(false)
      setIsReviewDialogOpen(false)
    }
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Logo and main information */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Optimized mobile header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                <div className="text-2xl md:text-4xl font-bold text-primary">
                  {seller.account.companyName.charAt(0)}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">{seller.account.companyName}</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-2 md:mb-4">{seller.account.companyStatus}</p>
                <div className="flex flex-col md:flex-row items-center gap-1 md:gap-4 mb-2 md:mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm md:text-base font-semibold">{mockStats.rating}</span>
                    <span className="text-xs md:text-sm text-muted-foreground">({mockStats.totalReviews} reviews)</span>
                  </div>
                  <Badge variant="secondary" className="text-xs md:text-sm">{mockStats.recommendationRate}% recommend</Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button
                    onClick={() => setIsReviewDialogOpen(true)}
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    disabled={isSubmittingReview}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {isSubmittingReview ? "Submitting..." : "Write a Review"}
                  </Button>
                  <Button
                    variant={isApproved ? "default" : "outline"}
                    onClick={handleApproveSeller}
                    disabled={isApproved || isSubmittingApproval}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    {isSubmittingApproval ? "Submitting..." : isApproved ? "Approved" : "I approve this seller"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Optimized mobile contact information */}
            <div className="bg-muted/30 rounded-lg p-3 md:p-4">
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="truncate">{seller.account.phonePrefix} {seller.account.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="truncate">{seller.account.email}</span>
                </div>
                {seller.address && (
                  <>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                      <span className="truncate">{seller.address.city}, {seller.address.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                      <span className="truncate">{seller.address.website}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <Card className="w-full md:w-80">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Watches sold</p>
                    <p className="text-2xl font-bold">{mockStats.totalSales}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                    <p className="text-2xl font-bold">{mockStats.rating}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Ratings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shipping</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{mockStats.ratings.shipping}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Description</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{mockStats.ratings.description}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Communication</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{mockStats.ratings.communication}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsContactDialogOpen(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Contact seller
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {review.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  {review.verified && (
                    <Badge variant="outline" className="mt-4">Verified Purchase</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                {seller.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{seller.address.street}</p>
                      <p className="text-muted-foreground">
                        {seller.address.postalCode} {seller.address.city}, {seller.address.country}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{seller.account.phonePrefix} {seller.account.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{seller.account.email}</p>
                  </div>
                </div>
                {seller.address?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Website</p>
                      <p className="text-muted-foreground">{seller.address.website}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Legal Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Company Type</p>
                    <p className="text-muted-foreground">{seller.account.companyStatus}</p>
                  </div>
                </div>
                {seller.address && (
                  <>
                    <div>
                      <p className="font-medium mb-2">SIREN Number</p>
                      <p className="text-muted-foreground">{seller.address.siren}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">VAT Number</p>
                      <p className="text-muted-foreground">{seller.address.vatNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Tax ID</p>
                      <p className="text-muted-foreground">{seller.address.taxId}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Current Offers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Current Offers</h2>
          {seller.listings.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentListing * 100}%)` }}>
                  {seller.listings.map((listing) => (
                    <div key={listing.id} className="w-full md:w-1/3 flex-shrink-0 px-2">
                      <Link href={`/listings/${listing.id}`}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <div className="relative aspect-square">
                            <Image
                              src={listing.image}
                              alt={`${listing.brand} ${listing.model}`}
                              fill
                              className="object-cover rounded-t-lg"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{listing.brand} {listing.model}</h3>
                            <p className="text-sm text-muted-foreground mb-2">Ref. {listing.reference}</p>
                            <p className="font-medium text-primary">{listing.price.toLocaleString()} {listing.currency}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation Buttons - Only show if there are multiple listings */}
              {seller.listings.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                    onClick={prevListing}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                    onClick={nextListing}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No active listings at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Dialog */}
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contact {seller.account.companyName}</DialogTitle>
              <DialogDescription>
                Send a message to the seller for more information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {isMessageSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                  <p className="text-lg font-medium text-center">Your message has been sent successfully!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    The seller will respond as soon as possible.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Your message</Label>
                    <Textarea
                      id="message"
                      placeholder="Hello, I am interested in your watches..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      {message.length} / 1000 characters
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>Seller: {seller.account.companyName}</p>
                    <p>Type: {seller.account.companyStatus}</p>
                    <p>Rating: {mockStats.rating} ({mockStats.totalReviews} reviews)</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              {!isMessageSuccess && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsContactDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitMessage}
                    disabled={!message.trim() || isSubmittingMessage}
                  >
                    {isSubmittingMessage ? "Sending..." : "Send message"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <ReviewDialog
          isOpen={isReviewDialogOpen}
          onClose={() => setIsReviewDialogOpen(false)}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
          title={`Review ${seller.account.companyName}`}
          description="Share your experience with this seller. Your review will help other buyers make informed decisions."
        />
      </div>
    </main>
  )
} 