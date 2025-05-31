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
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentPopularModel, setCurrentPopularModel] = useState(0)
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
  const [notifyPriceChange, setNotifyPriceChange] = useState(false)
  const [notifySale, setNotifySale] = useState(false)
  const [listing, setListing] = useState<ListingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch listing')
        }
        const data = await response.json()
        setListing(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params.id])

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
    if (!offerAmount || isNaN(Number(offerAmount))) return

    setIsSubmittingOffer(true)
    try {
      // TODO: Submit offer to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsOfferSuccess(true)
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOfferDialogOpen(false)
        setIsOfferSuccess(false)
        setOfferAmount("")
      }, 2000)
    } catch (error) {
      console.error(error)
      // TODO: Show error message
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  const handleSubmitMessage = async () => {
    if (!message.trim()) return

    setIsSubmittingMessage(true)
    try {
      // TODO: Submit message to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsMessageSuccess(true)
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsContactDialogOpen(false)
        setIsMessageSuccess(false)
        setMessage("")
      }, 2000)
    } catch (error) {
      console.error(error)
      // TODO: Show error message
    } finally {
      setIsSubmittingMessage(false)
    }
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
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <p className="text-muted-foreground">{listing.reference}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Dialog open={showNotificationTooltip} onOpenChange={setShowNotificationTooltip}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                    >
                      <Bell className={`h-5 w-5 ${(notifyPriceChange || notifySale) ? "text-primary" : ""}`} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-80 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <p className="font-medium">Receive notifications</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price-change" className="text-sm">Price change</Label>
                          <Switch
                            id="price-change"
                            checked={notifyPriceChange}
                            onCheckedChange={setNotifyPriceChange}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sale" className="text-sm">For sale</Label>
                          <Switch
                            id="sale"
                            checked={notifySale}
                            onCheckedChange={setNotifySale}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You will receive an email for each activated notification.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
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
                        <div className="text-sm text-muted-foreground">
                          <p>Seller: {listing.seller.name}</p>
                          <p>Type: {listing.seller.type}</p>
                          <p>Rating: {listing.seller.stats.rating} ({listing.seller.stats.totalReviews} reviews)</p>
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
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Buy
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsOfferDialogOpen(true)}
                >
                  Make an offer
                </Button>
              </div>
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

            {/* Status and Stats */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {watchConditions.find(c => c.slug === listing.condition)?.label} | Manufacturing year {listing.year} | {listing.included === "full-set" ? "With original box and papers" : listing.included}
              </p>
            </div>

            {/* Seller Card */}
            {listing.seller && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={listing.seller.logo}
                          alt={`${listing.seller.name} logo`}
                          width={64}
                          height={64}
                          className="object-contain p-2"
                        />
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
                      <Link href={`/sellers/${listing.seller.id}`}>
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
  )
} 