"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, Award, MapPin, Phone, Mail, Globe, Building2, Clock, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import mockSellers from "@/data/mock-sellers.json"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Seller {
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
    addressComplement: string
    postalCode: string
    city: string
    country: string
    website: string
    siren: string
    taxId: string
    vatNumber: string
  }
  banking: {
    cardHolder: string
    bankName: string
    paymentMethod: string
  }
}

// Mock data pour les statistiques et évaluations
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
    author: "Jean Dupont",
    date: "2024-03-15",
    rating: 5,
    comment: "Excellent service, livraison rapide et montre en parfait état. Je recommande vivement !",
    verified: true
  },
  {
    id: "2",
    author: "Marie Martin",
    date: "2024-03-10",
    rating: 5,
    comment: "Vendeur très professionnel, communication claire et précise. La montre correspond parfaitement à la description.",
    verified: true
  },
  {
    id: "3",
    author: "Pierre Durand",
    date: "2024-03-05",
    rating: 4,
    comment: "Très bon service, juste un petit délai de livraison mais rien de grave. Je suis satisfait de mon achat.",
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

export default function SellerPage({ params }: SellerPageProps) {
  const [currentListing, setCurrentListing] = useState(0)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)
  const [isMessageSuccess, setIsMessageSuccess] = useState(false)
  
  const seller = mockSellers.sellers.find(s => s.account.username === params.id)

  if (!seller) {
    return <div>Revendeur non trouvé</div>
  }

  const nextListing = () => {
    setCurrentListing((prev) => 
      prev === mockFeaturedListings.length - 1 ? 0 : prev + 1
    )
  }

  const prevListing = () => {
    setCurrentListing((prev) => 
      prev === 0 ? mockFeaturedListings.length - 1 : prev - 1
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

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Logo et informations principales */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* En-tête mobile optimisé */}
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
                    <span className="text-xs md:text-sm text-muted-foreground">({mockStats.totalReviews} avis)</span>
                  </div>
                  <Badge variant="secondary" className="text-xs md:text-sm">{mockStats.recommendationRate}% recommandent</Badge>
                </div>
              </div>
            </div>

            {/* Informations de contact mobile optimisées */}
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
                <div className="flex items-center gap-1.5 md:gap-2">
                  <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="truncate">{seller.address.city}, {seller.address.country}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2">
                  <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  <span className="truncate">{seller.address.website}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Statistiques */}
          <Card className="w-full md:w-80">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Statistiques</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Montres vendues</p>
                    <p className="text-2xl font-bold">{mockStats.totalSales}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Note moyenne</p>
                    <p className="text-2xl font-bold">{mockStats.rating}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Évaluations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expédition</span>
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
                Contacter le vendeur
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Avis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
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
                    <Badge variant="outline" className="mt-4">Achat vérifié</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{seller.address.street}</p>
                    <p className="text-muted-foreground">
                      {seller.address.postalCode} {seller.address.city}, {seller.address.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
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
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Site web</p>
                    <p className="text-muted-foreground">{seller.address.website}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Informations légales</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Type d'entreprise</p>
                    <p className="text-muted-foreground">{seller.account.companyStatus}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Numéro SIREN</p>
                  <p className="text-muted-foreground">{seller.address.siren}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Numéro de TVA</p>
                  <p className="text-muted-foreground">{seller.address.vatNumber}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Identifiant fiscal</p>
                  <p className="text-muted-foreground">{seller.address.taxId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meilleures offres du moment */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meilleures offres du moment</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentListing * 100}%)` }}>
                {mockFeaturedListings.map((listing) => (
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
                          <p className="font-medium text-primary">{listing.price.toLocaleString()} €</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
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
          </div>
        </div>

        {/* Contact Dialog */}
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contacter {seller.account.companyName}</DialogTitle>
              <DialogDescription>
                Envoyez un message au vendeur pour plus d'informations.
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
                      placeholder="Bonjour, je suis intéressé par vos montres..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <p className="text-sm text-muted-foreground">
                      {message.length} / 1000 caractères
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>Vendeur : {seller.account.companyName}</p>
                    <p>Type : {seller.account.companyStatus}</p>
                    <p>Note : {mockStats.rating} ({mockStats.totalReviews} avis)</p>
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
      </div>
    </main>
  )
} 