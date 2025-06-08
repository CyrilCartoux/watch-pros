"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Shield, Clock, Package, Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Bell, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { watchConditions } from "@/data/watch-conditions"
import { useFavorites } from "@/hooks/useFavorites"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useRouter } from "next/navigation"
import { countries } from '@/data/form-options'

interface ListingData {
  id: string
  brand: string
  model: string
  reference: string
  title: string
  description: string
  year: string
  gender: string
  condition: string
  serialNumber: string
  dialColor: string | null
  diameter: {
    min: string
    max: string
  }
  movement: string | null
  case: string
  braceletMaterial: string
  braceletColor: string
  included: string
  images: string[]
  price: number
  currency: string
  shippingDelay: string
  seller: {
    id: string
    name: string
    logo: string
    type: string
    companyLogo: string
    description: string
    location: {
      address: string
      city: string
      postalCode: string
      country: string
    }
    contact: {
      phone: string
      mobile: string
      email: string
      languages: string[]
    }
    business: {
      vatNumber: string
      hasPhysicalStore: boolean
      yearsOfExperience: number
      specialties: string[]
    }
    stats: {
      totalSales: number
      rating: number
      totalReviews: number
      recommendationRate: number
      ratings: {
        shipping: number
        description: number
        communication: number
      }
    }
    certifications: {
      name: string
      description: string
      icon: string
    }[]
  } | null
  listing_type: string
  type: string
  country?: string
}

interface Props {
  params: {
    id: string
  }
}

export default function ListingPage({ params }: Props) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false)
  const [offerAmount, setOfferAmount] = useState("")
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [isOfferSuccess, setIsOfferSuccess] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)
  const [isMessageSuccess, setIsMessageSuccess] = useState(false)
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false)
  const [notifyListing, setNotifyListing] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [listing, setListing] = useState<ListingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()
  const router = useRouter()
  const [isDeclareSaleDialogOpen, setIsDeclareSaleDialogOpen] = useState(false)
  const [finalPrice, setFinalPrice] = useState("")
  const [isSubmittingSale, setIsSubmittingSale] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch listing')
        }
        const data = await response.json()
        setListing(data)

        // Fetch subscription status if user is logged in
        if (user) {
          const subResponse = await fetch('/api/subscribe-listing')
          if (subResponse.ok) {
            const { subscriptions } = await subResponse.json()
            const isSubscribed = subscriptions.some((sub: any) => sub.listing.id === params.id)
            setNotifyListing(isSubscribed)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params.id, user])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!listing) return
    if (touchStart - touchEnd > 75) {
      setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
    }
    if (touchStart - touchEnd < -75) {
      setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
    }
  }

  const handleSubmitOffer = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make an offer",
        variant: "destructive",
      })
      return
    }

    if (!listing) {
      toast({
        title: "Error",
        description: "Listing not found",
        variant: "destructive",
      })
      return
    }

    if (!offerAmount) {
      toast({
        title: "Invalid offer",
        description: "Please enter an offer amount",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingOffer(true)
    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listing.id,
          offer: parseFloat(offerAmount),
          currency: listing.currency
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to submit offer")
      }

      const { offer } = await response.json()
      setIsOfferSuccess(true)
      toast({
        title: "Offer submitted",
        description: "Your offer has been submitted successfully",
      })
      setOfferAmount("")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit offer"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  const handleSubmitMessage = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send a message",
        variant: "destructive",
      })
      return
    }

    if (!message) {
      toast({
        title: "Invalid message",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingMessage(true)
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listing?.id,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      })
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  const handleFavoriteClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      })
      return
    }

    if (!listing) {
      toast({
        title: "Error",
        description: "Listing not found",
        variant: "destructive",
      })
      return;
    }
      if (isFavorite(listing.id)) {
        await removeFavorite(listing.id)
        toast({
          title: "Removed from favorites",
          description: "The listing has been removed from your favorites",
        })
      } else {
        await addFavorite(listing.id)
        toast({
          title: "Added to favorites",
          description: "The listing has been added to your favorites",
        })
      }
  }

  const toggleNotification = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to set notifications",
        variant: "destructive",
      })
      return
    }

    if (!listing) {
      toast({
        title: "Error",
        description: "Listing not found",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubscribing(true)
      
      const method = notifyListing ? 'DELETE' : 'POST'
      const response = await fetch('/api/subscribe-listing', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listing_id: listing.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to toggle notification')
      }

      setNotifyListing(!notifyListing)
      setShowNotificationTooltip(false)

      toast({
        title: notifyListing ? "Notification disabled" : "Notification enabled",
        description: notifyListing 
          ? "You will no longer receive notifications for this listing"
          : "You will be notified about price updates and when this watch is sold",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update notification settings"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleDeclareSale = async () => {
    if (!listing) return

    setIsSubmittingSale(true)
    try {
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          finalPrice: finalPrice ? parseFloat(finalPrice) : null
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to declare sale")
      }

      toast({
        title: "Sale declared",
        description: "The listing has been marked as sold",
      })
      setIsDeclareSaleDialogOpen(false)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to declare sale"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmittingSale(false)
    }
  }

  const getCountryLabel = (countryCode: string | null) => {
    if (!countryCode) return null
    const country = countries.find(c => c.value === countryCode)
    return country ? `${country.flag} ${country.label}` : null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-12 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground">{error || 'Listing not found'}</p>
            <Button className="mt-4" asChild>
              <Link href="/listings">Back to listings</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireSeller requireVerified>
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square rounded-lg overflow-hidden bg-muted"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={listing.images[currentImage]}
                alt={listing.title}
                fill
                className="object-cover"
              />
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                onClick={() => setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                onClick={() => setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    currentImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <p className="text-muted-foreground">{listing.reference}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavoriteClick}
                >
                  <Heart className={`h-5 w-5 ${isFavorite(listing.id) ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Dialog open={showNotificationTooltip} onOpenChange={setShowNotificationTooltip}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        if (user) {
                          toggleNotification()
                        } else {
                          setShowNotificationTooltip(true)
                        }
                      }}
                      className={notifyListing ? "bg-red-50 hover:bg-red-100 border-red-200" : ""}
                    >
                      <Bell className={`h-5 w-5 ${notifyListing ? "text-red-500 fill-red-500" : ""}`} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-80 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <p className="font-medium">Receive notifications</p>
                      </div>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          You will receive notifications about price updates and when this watch is sold.
                        </p>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-listing" className="text-sm">Enable notifications</Label>
                          <Switch
                            id="notify-listing"
                            checked={notifyListing}
                            onCheckedChange={toggleNotification}
                            disabled={isSubscribing}
                          />
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Contact Dialog */}
            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact seller</DialogTitle>
                  <DialogDescription>
                    Send a message to the seller for more information about this watch.
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
                          placeholder="Hello, I am interested in this watch..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          {message.length} / 1000 characters
                        </p>
                      </div>

                      {listing.seller && (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{listing.seller.contact.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{listing.seller.contact.phone}</span>
                          </div>
                          {listing.seller.contact.mobile && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.seller.contact.mobile}</span>
                            </div>
                          )}
                        </div>
                      )}
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

            {/* Price and Shipping */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold">{listing.price.toLocaleString()} {listing.currency}</p>
                <p className="text-muted-foreground">Estimated delivery: {listing.shippingDelay} business days</p>
              </div>
              {user?.id === listing.seller?.id ? (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setIsDeclareSaleDialogOpen(true)}
                >
                  Declare Sale
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsOfferDialogOpen(true)}
                >
                  Make an offer
                </Button>
              )}
            </div>

            {/* Offer Dialog */}
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make an offer</DialogTitle>
                  <DialogDescription>
                    Propose a price to the seller for this watch. The seller will be notified of your offer and can accept or decline it.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isOfferSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                      <p className="text-lg font-medium text-center">Your offer has been sent successfully!</p>
                      <p className="text-sm text-muted-foreground text-center">
                        The seller will be notified and can accept or decline your offer.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="offerAmount">Offer amount (€)</Label>
                        <Input
                          id="offerAmount"
                          type="number"
                          placeholder="0"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                      </div>

                      {/* Discount suggestions */}
                      <div className="grid grid-cols-3 gap-2">
                        {[5, 10, 15].map((reduction) => (
                          <button
                            key={reduction}
                            onClick={() => {
                              const reducedPrice = Math.round(listing.price * (1 - reduction / 100))
                              setOfferAmount(reducedPrice.toString())
                            }}
                            className="p-3 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                          >
                            <p className="font-medium">-{reduction}%</p>
                            <p className="text-sm text-muted-foreground">
                              {Math.round(listing.price * (1 - reduction / 100)).toLocaleString()} €
                            </p>
                          </button>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Asking price: {listing.price.toLocaleString()} €</p>
                        <p>Your offer: {Number(offerAmount).toLocaleString()} €</p>
                        <p className="font-medium text-primary">
                          Difference: {(Number(offerAmount) - listing.price).toLocaleString()} €
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  {!isOfferSuccess && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmitOffer}
                        disabled={!offerAmount || isNaN(Number(offerAmount)) || isSubmittingOffer}
                      >
                        {isSubmittingOffer ? "Sending..." : "Send offer"}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Declare Sale Dialog */}
            <Dialog open={isDeclareSaleDialogOpen} onOpenChange={setIsDeclareSaleDialogOpen}>
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
                    onClick={() => setIsDeclareSaleDialogOpen(false)}
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

            {/* Status and Stats */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {listing.listing_type === "watch" ? (
                  <>
                    {watchConditions.find(c => c.slug === listing.condition)?.label} | 
                    Manufacturing year {listing.year} | 
                    {listing.included === "full-set" ? "With original box and papers" : 
                     listing.included === "box-only" ? "With original box" :
                     listing.included === "papers-only" ? "With original papers" :
                     "Watch only"}
                  </>
                ) : (
                  <>
                    {listing.condition === "new" ? "New - Never worn" : "Used"} | 
                    {listing.year && `Manufacturing year ${listing.year} | `}
                    {listing.type}
                  </>
                )}
              </p>
            </div>

            {/* Seller Card */}
            {listing.seller && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                        {listing.seller.companyLogo ? (
                          <Image
                            src={listing.seller.companyLogo}
                            alt={`${listing.seller.name} logo`}
                            width={96}
                            height={96}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-3xl font-bold text-primary">
                            {listing.seller.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{listing.seller.name}</h3>
                            <p className="text-sm text-muted-foreground">{listing.seller.type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <span className="font-medium">{listing.seller.stats.rating}</span>
                            <span className="text-sm text-muted-foreground">({listing.seller.stats.totalReviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.seller.location.city}, {listing.seller.location.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{listing.seller.contact.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {listing.seller.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
                          <Shield className="h-3 w-3 text-primary" />
                          <span>{cert.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link href={`/sellers/${listing.seller.name}`}>
                        <Button variant="outline" className="w-full">
                          View full profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Technical Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Basic data</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Listing code</dt>
                      <dd>{listing.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Brand</dt>
                      <dd>{listing.brand}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Model</dt>
                      <dd>{listing.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Reference number</dt>
                      <dd>{listing.reference}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Year</dt>
                      <dd>{listing.year}</dd>
                    </div>
                    {listing.country && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Country of Origin</dt>
                        <dd>{getCountryLabel(listing.country)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Specifications</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Movement</dt>
                      <dd>{listing.movement}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Case</dt>
                      <dd>{listing.case}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Bracelet material</dt>
                      <dd>{listing.braceletMaterial}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Manufacturing year</dt>
                      <dd>{listing.year}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p>{listing.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  )
} 