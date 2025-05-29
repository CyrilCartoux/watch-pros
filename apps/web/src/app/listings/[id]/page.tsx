"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Shield, Clock, Package, Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Bell, MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, TouchEvent } from "react"
import listingsData from "@/data/listings2.json"
import brandsData from "@/data/brands.json"
import sellersData from "@/data/sellers.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  dialColor: string
  diameter: {
    min: string
    max: string
  }
  movement: string
  case: string
  braceletMaterial: string
  braceletColor: string
  included: string
  images: string[]
  price: number
  currency: string
  shippingDelay: string
  documents: any[]
  seller?: string
}

interface SellerData {
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
}

interface SellersData {
  [key: string]: SellerData
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

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
    }
    if (touchStart - touchEnd < -75) {
      setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
    }
  }

  const listing = listingsData[params.id as keyof typeof listingsData] as unknown as ListingData
  if (!listing) {
    return <div>Listing non trouvé</div>
  }

  const brandInfo = brandsData[listing.brand.toLowerCase() as keyof typeof brandsData]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const nextPopularModel = () => {
    setCurrentPopularModel((prev) => 
      prev === brandInfo.featuredModels.length - 1 ? 0 : prev + 1
    )
  }

  const prevPopularModel = () => {
    setCurrentPopularModel((prev) => 
      prev === 0 ? brandInfo.featuredModels.length - 1 : prev - 1
    )
  }

  const handleSubmitOffer = async () => {
    if (!offerAmount || isNaN(Number(offerAmount))) return

    setIsSubmittingOffer(true)
    try {
      // TODO: Submit offer to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsOfferSuccess(true)
      // Fermer la modale après 2 secondes
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
      // Fermer la modale après 2 secondes
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
                        <p className="font-medium">Recevoir des notifications</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="price-change" className="text-sm">Changement de prix</Label>
                          <Switch
                            id="price-change"
                            checked={notifyPriceChange}
                            onCheckedChange={setNotifyPriceChange}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sale" className="text-sm">Mise en vente</Label>
                          <Switch
                            id="sale"
                            checked={notifySale}
                            onCheckedChange={setNotifySale}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Vous recevrez un email pour chaque notification activée.
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
                  <DialogTitle>Contacter le vendeur</DialogTitle>
                  <DialogDescription>
                    Envoyez un message au vendeur pour plus d'informations sur cette montre.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isMessageSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                      <p className="text-lg font-medium text-center">Votre message a été envoyé avec succès !</p>
                      <p className="text-sm text-muted-foreground text-center">
                        Le vendeur vous répondra dès que possible.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">Votre message</Label>
                        <Textarea
                          id="message"
                          placeholder="Bonjour, je suis intéressé par cette montre..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="min-h-[150px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          {message.length} / 1000 caractères
                        </p>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Vendeur : {(sellersData as SellersData)[listing.seller]?.name}</p>
                        <p>Type : {(sellersData as SellersData)[listing.seller]?.type}</p>
                        <p>Note : {(sellersData as SellersData)[listing.seller]?.stats.rating} ({(sellersData as SellersData)[listing.seller]?.stats.totalReviews} avis)</p>
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
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSubmitMessage}
                        disabled={!message.trim() || isSubmittingMessage}
                      >
                        {isSubmittingMessage ? "Envoi..." : "Envoyer le message"}
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
                <p className="text-muted-foreground">Livraison estimée : {listing.shippingDelay} jours ouvrés</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Acheter
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsOfferDialogOpen(true)}
                >
                  Faire une offre
                </Button>
              </div>
            </div>

            {/* Offer Dialog */}
            <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Faire une offre</DialogTitle>
                  <DialogDescription>
                    Proposez un prix au vendeur pour cette montre. Le vendeur sera notifié de votre offre et pourra l'accepter ou la refuser.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {isOfferSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                      <p className="text-lg font-medium text-center">Votre offre a été envoyée avec succès !</p>
                      <p className="text-sm text-muted-foreground text-center">
                        Le vendeur sera notifié et pourra accepter ou refuser votre offre.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="offerAmount">Montant de l'offre (€)</Label>
                        <Input
                          id="offerAmount"
                          type="number"
                          placeholder="0"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                      </div>

                      {/* Suggestions de réduction */}
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
                        <p>Prix demandé : {listing.price.toLocaleString()} €</p>
                        <p>Votre offre : {Number(offerAmount).toLocaleString()} €</p>
                        <p className="font-medium text-primary">
                          Différence : {(Number(offerAmount) - listing.price).toLocaleString()} €
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
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSubmitOffer}
                        disabled={!offerAmount || isNaN(Number(offerAmount)) || isSubmittingOffer}
                      >
                        {isSubmittingOffer ? "Envoi..." : "Envoyer l'offre"}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Status and Stats */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {watchConditions.find(c => c.slug === listing.condition)?.label} | Année de fabrication {listing.year} | {listing.included === "full-set" ? "Avec boîte et papiers d'origine" : listing.included}
              </p>
            </div>

            {/* Seller Card */}
            <Card>
              <CardContent className="p-6">
                {listing.seller && (sellersData as SellersData)[listing.seller] && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                        <Image
                          src={(sellersData as SellersData)[listing.seller].logo}
                          alt={`${(sellersData as SellersData)[listing.seller].name} logo`}
                          width={64}
                          height={64}
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{(sellersData as SellersData)[listing.seller].name}</h3>
                            <p className="text-sm text-muted-foreground">{(sellersData as SellersData)[listing.seller].type}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            <span className="font-medium">{(sellersData as SellersData)[listing.seller].stats.rating}</span>
                            <span className="text-sm text-muted-foreground">({(sellersData as SellersData)[listing.seller].stats.totalReviews})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{(sellersData as SellersData)[listing.seller].location.city}, {(sellersData as SellersData)[listing.seller].location.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{(sellersData as SellersData)[listing.seller].contact.phone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(sellersData as SellersData)[listing.seller].certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs">
                          <Shield className="h-3 w-3 text-primary" />
                          <span>{cert.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link href={`/sellers/${listing.seller}`}>
                        <Button variant="outline" className="w-full">
                          Voir le profil complet
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Technical Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Données de base</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Code annonce</dt>
                      <dd>{listing.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Marque</dt>
                      <dd>{brandInfo.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Modèle</dt>
                      <dd>{listing.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Numéro de référence</dt>
                      <dd>{listing.reference}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Spécifications</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Mouvement</dt>
                      <dd>{listing.movement}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Boîtier</dt>
                      <dd>{listing.case}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Matière du bracelet</dt>
                      <dd>{listing.braceletMaterial}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Année de fabrication</dt>
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

        {/* Brand Card */}
        <div className="mt-8">
          <Link href={`/brands/${brandInfo.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={brandInfo.logo}
                      alt={`${brandInfo.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{brandInfo.name}</h3>
                    <p className="text-muted-foreground">Découvrir tous les modèles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Popular Models Carousel */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Autres montres populaires de {brandInfo.name}</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPopularModel * 100}%)` }}>
                {brandInfo.featuredModels.map((model, index) => (
                  <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-2">
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square">
                        <Image
                          src={model.image}
                          alt={`${brandInfo.name} ${model.name}`}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{model.description}</p>
                        <p className="font-medium text-primary text-sm">{model.price}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={prevPopularModel}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={nextPopularModel}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(brandInfo.featuredModels.length / (isMobile ? 1 : 3)) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPopularModel === index ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentPopularModel(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 