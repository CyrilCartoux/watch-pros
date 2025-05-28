"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, Award, MapPin, Phone, Mail, Globe, Building2, Clock, ChevronLeft, ChevronRight, MessageSquare, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import sellersData from "@/data/sellers.json"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Certification {
  name: string
  description: string
  icon: "shield-check" | "award"
}

interface FeaturedListing {
  id: string
  brand: string
  model: string
  reference: string
  price: number
  image: string
}

interface Review {
  id: string
  author: string
  date: string
  rating: number
  comment: string
  verified: boolean
}

interface Seller {
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
  reviews: Review[]
  featuredListings: FeaturedListing[]
  certifications: Certification[]
}

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
  const seller = sellersData[params.id as keyof typeof sellersData] as Seller

  if (!seller) {
    return <div>Revendeur non trouvé</div>
  }

  const nextListing = () => {
    setCurrentListing((prev) => 
      prev === seller.featuredListings.length - 1 ? 0 : prev + 1
    )
  }

  const prevListing = () => {
    setCurrentListing((prev) => 
      prev === 0 ? seller.featuredListings.length - 1 : prev - 1
    )
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
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Logo et informations principales */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/20">
                <Image
                  src={seller.logo}
                  alt={`${seller.name} logo`}
                  width={96}
                  height={96}
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                <p className="text-muted-foreground mb-4">{seller.type}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{seller.stats.rating}</span>
                    <span className="text-muted-foreground">({seller.stats.totalReviews} avis)</span>
                  </div>
                  <Badge variant="secondary">{seller.stats.recommendationRate}% recommandent</Badge>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{seller.description}</p>

            <div className="flex flex-wrap gap-4">
              {seller.certifications.map((cert: Certification, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  {cert.icon === "shield-check" ? (
                    <Shield className="h-5 w-5 text-primary" />
                  ) : (
                    <Award className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </div>
                </div>
              ))}
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
                    <p className="text-2xl font-bold">{seller.stats.totalSales}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Années d'expérience</p>
                    <p className="text-2xl font-bold">{seller.business.yearsOfExperience}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Évaluations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Expédition</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{seller.stats.ratings.shipping}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Description</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{seller.stats.ratings.description}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Communication</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{seller.stats.ratings.communication}</span>
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

        {/* Meilleures offres du moment */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meilleures offres du moment</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentListing * 100}%)` }}>
                {seller.featuredListings.map((listing: FeaturedListing) => (
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

        {/* Informations de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{seller.location.address}</p>
                    <p className="text-muted-foreground">
                      {seller.location.postalCode} {seller.location.city}, {seller.location.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Téléphone</p>
                    <p className="text-muted-foreground">{seller.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{seller.contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Langues parlées</p>
                    <p className="text-muted-foreground">{seller.contact.languages.join(", ")}</p>
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
                    <p className="text-muted-foreground">{seller.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Années d'expérience</p>
                    <p className="text-muted-foreground">{seller.business.yearsOfExperience} ans</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Numéro de TVA</p>
                  <p className="text-muted-foreground">{seller.business.vatNumber}</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Spécialités</p>
                  <div className="flex flex-wrap gap-2">
                    {seller.business.specialties.map((specialty: string, index: number) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Avis */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seller.reviews.map((review: Review) => (
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

        {/* Contact Dialog */}
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Contacter {seller.name}</DialogTitle>
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
                    <p>Vendeur : {seller.name}</p>
                    <p>Type : {seller.type}</p>
                    <p>Note : {seller.stats.rating} ({seller.stats.totalReviews} avis)</p>
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