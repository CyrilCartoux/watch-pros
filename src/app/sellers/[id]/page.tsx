"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Phone, Mail, Globe, Building2, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2, ThumbsUp, Coins, Shield, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/AuthContext"
import { ReviewDialog } from "@/components/ReviewDialog"
import { countries } from "@/data/form-options"
import { useToast } from "@/components/ui/use-toast"

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
    cryptoFriendly: boolean
    companyLogo?: string
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
  stats: {
    totalReviews: number
    averageRating: number
    lastUpdated: string
  }
  reviews?: {
    id: string
    rating: number
    comment: string
    createdAt: string
    reviewerId?: string
    reviewerName?: string
    reviewerCompanyLogo?: string
  }[] 
}

interface ReviewData {
  rating: number
  comment: string
}

interface SellerPageProps {
  params: {
    id: string
  }
}

function ReviewComment({ comment }: { comment: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const maxLength = 150 // Maximum characters to show before truncating

  if (comment.length <= maxLength) {
    return <p className="text-sm text-muted-foreground">{comment}</p>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {isExpanded ? comment : `${comment.slice(0, maxLength)}...`}
      </p>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            See less
            <ChevronUp className="ml-1 h-3 w-3" />
          </>
        ) : (
          <>
            See more
            <ChevronDown className="ml-1 h-3 w-3" />
          </>
        )}
      </Button>
    </div>
  )
}

function getCountryFlag(countryCode: string): string {
  // Convert country code to regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function SellerDetailPage({ params }: SellerPageProps) {
  const { toast } = useToast()
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
  const { user } = useAuth()
  const [isDeletingReview, setIsDeletingReview] = useState<string | null>(null)
  const [reviewsPage, setReviewsPage] = useState(1)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const reviewsPerPage = 6

  // Mémoriser les calculs de pagination des reviews
  const paginatedReviews = useMemo(
    () => seller?.reviews?.slice(0, showAllReviews ? undefined : reviewsPerPage * reviewsPage),
    [seller?.reviews, showAllReviews, reviewsPage]
  )

  const hasMoreReviews = useMemo(
    () => (seller?.reviews?.length ?? 0) > reviewsPerPage * reviewsPage,
    [seller?.reviews, reviewsPage]
  )

  // Stabiliser les handlers du carrousel
  const nextListing = useCallback(() => {
    if (!seller?.listings?.length) return
    setCurrentListing(prev => (prev + 1) % seller.listings.length)
  }, [seller?.listings])

  const prevListing = useCallback(() => {
    if (!seller?.listings?.length) return
    setCurrentListing(prev => (prev - 1 + seller.listings.length) % seller.listings.length)
  }, [seller?.listings])

  // Stabiliser les handlers des dialogues
  const handleOpenContactDialog = useCallback(() => {
    setIsContactDialogOpen(true)
  }, [])

  const handleCloseContactDialog = useCallback(() => {
    setIsContactDialogOpen(false)
    setMessage("")
    setIsMessageSuccess(false)
  }, [])

  const handleOpenReviewDialog = useCallback(() => {
    setIsReviewDialogOpen(true)
  }, [])

  const handleCloseReviewDialog = useCallback(() => {
    setIsReviewDialogOpen(false)
  }, [])

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`/api/sellers/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Seller not found')
          }
          throw new Error('Failed to fetch seller')
        }
        const data = await response.json()
        if (!data) {
          throw new Error('Seller not found')
        }
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
            <div className="w-24 h-24 mx-auto mb-6 text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {error === 'Seller not found' ? 'Seller Not Found' : 'Error'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error === 'Seller not found' 
                ? "We couldn't find the seller you're looking for. They may have been removed or the link might be incorrect."
                : error || 'An unexpected error occurred'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Button
                onClick={() => window.location.href = '/sellers'}
              >
                Browse All Sellers
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const handleSubmitMessage = async () => {
    if (!message.trim() || !user) return

    setIsSubmittingMessage(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otherUserId: seller.id,
          initialMessage: message.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsMessageSuccess(true)
      setTimeout(() => {
        setIsContactDialogOpen(false)
        setIsMessageSuccess(false)
        setMessage("")
      }, 2000)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive",
      })
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  const handleSubmitReview = async (review: ReviewData) => {
    if (!user || !seller?.id) return

    setIsSubmittingReview(true)
    try {
      const response = await fetch(`/api/sellers/${seller.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(review)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      // Refresh seller data to get updated reviews
      const sellerResponse = await fetch(`/api/sellers/${params.id}`)
      if (sellerResponse.ok) {
        const updatedSeller = await sellerResponse.json()
        setSeller(updatedSeller)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit review')
    } finally {
      setIsSubmittingReview(false)
      setIsReviewDialogOpen(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!user || !seller?.id) return

    setIsDeletingReview(reviewId)
    try {
      const response = await fetch(`/api/sellers/${seller.id}/reviews?reviewId=${reviewId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review')
      }

      // Refresh seller data to get updated reviews
      const sellerResponse = await fetch(`/api/sellers/${params.id}`)
      if (sellerResponse.ok) {
        const updatedSeller = await sellerResponse.json()
        setSeller(updatedSeller)
        toast({
          title: "Review deleted",
          description: "Your review has been removed.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete review',
        variant: "destructive",
      })
    } finally {
      setIsDeletingReview(null)
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
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                {seller.account.companyLogo ? (
                  <Image
                    src={seller.account.companyLogo}
                    alt={`${seller.account.companyName} logo`}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-3xl font-bold text-primary">
                    {seller.account.companyName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1 md:mb-2">
                  <h1 className="text-xl md:text-3xl font-bold">{seller.account.companyName}</h1>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
                    <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="font-medium">Verified</span>
                  </Badge>
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-2 md:mb-4">{seller.account.companyStatus}</p>

                {/* Mobile Tags */}
                <div className="md:hidden flex flex-wrap gap-2 mb-4">
                  {seller.account.cryptoFriendly && (
                    <Badge variant="outline" className="text-xs border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                      <Coins className="h-3 w-3 mr-1" />
                      Accepts Crypto
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getCountryFlag(seller.account.country)} {countries.find(c => c.value === seller.account.country)?.label}
                  </Badge>
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
                      <span className="truncate">{seller.address.city}, {countries.find(c => c.value === seller.address?.country)?.label}</span>
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
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average rating</p>
                    <div className="flex items-center gap-1">
                      <p className="text-2xl font-bold">{seller.stats.averageRating.toFixed(1)}</p>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Ratings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total reviews</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{seller.stats.totalReviews}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Last updated</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(seller.stats.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleOpenContactDialog}
              >
                <MessageSquare className="h-4 w-4" />
                Contact seller
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Reviews */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Peer Reviews</h2>
            {user && (
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenReviewDialog}
                className="gap-1 bg-primary hover:bg-primary/90 text-white font-medium shadow-sm w-full sm:w-auto"
              >
                <ThumbsUp className="h-4 w-4" />
                Leave a review
              </Button>
            )}
          </div>
          {seller.reviews && seller.reviews.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {seller.reviews.length} reviews
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="gap-1"
              >
                {showAllReviews ? (
                  <>
                    Show Less
                    <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seller.reviews && seller.reviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No reviews yet</p>
              </CardContent>
            </Card>
          ) : (
            paginatedReviews?.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                        {review.reviewerCompanyLogo ? (
                          <Image
                            src={review.reviewerCompanyLogo}
                            alt={`${review.reviewerName} logo`}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-primary">
                            {review.reviewerName ? review.reviewerName.slice(0, 1) : 'A'}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/sellers/${review.reviewerName}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {review.reviewerName || 'Anonymous'}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {user && review.reviewerId === user.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isDeletingReview === review.id}
                      >
                        {isDeletingReview === review.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <ReviewComment comment={review.comment} />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {!showAllReviews && hasMoreReviews && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setReviewsPage(prev => prev + 1)}
              className="gap-2"
            >
              Load More Reviews
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-12">
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

        {/* Best current offers */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current offers</h2>
          
          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentListing * 100}%)` }}>
                {seller.listings?.slice(0, 5).map((listing) => (
                  <div key={listing.id} className="w-full flex-shrink-0 px-2">
                    <Link href={`/listings/${listing.id}`} className="group">
                      <Card className="overflow-hidden transition-all hover:shadow-md">
                        <div className="aspect-square relative">
                          <Image
                            src={listing.image}
                            alt={`${listing.brand} ${listing.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-2">
                          <div className="space-y-1">
                            <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {listing.brand} {listing.model}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Ref. {listing.reference}
                            </p>
                            <p className="text-sm font-medium">
                              {listing.price.toLocaleString()} {listing.currency}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons - Only show if there are multiple listings */}
            {seller.listings && seller.listings.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-8 h-8"
                  onClick={prevListing}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-8 h-8"
                  onClick={nextListing}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {seller.listings?.slice(0, 5).map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-square relative">
                    <Image
                      src={listing.image}
                      alt={`${listing.brand} ${listing.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.brand} {listing.model}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Ref. {listing.reference}
                      </p>
                      <p className="text-sm font-medium">
                        {listing.price.toLocaleString()} {listing.currency}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
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
                    <p>Rating: {seller.stats.averageRating.toFixed(1)} ({seller.stats.totalReviews} reviews)</p>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              {!isMessageSuccess && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCloseContactDialog}
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
          onClose={handleCloseReviewDialog}
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmittingReview}
          title={`Review ${seller.account.companyName}`}
          description="Share your experience with this seller. Your review will help other buyers make informed decisions."
        />
      </div>
    </main>
  )
} 