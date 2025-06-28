"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  FileText, 
  CreditCard, 
  Calendar,
  Coins,
  ExternalLink,
  Eye
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { countries } from "@/data/form-options"
import Image from "next/image"

interface SellerAddress {
  city: string
  siren: string
  street: string
  tax_id: string
  country: string
  website: string
  vat_number: string
  postal_code: string
}

interface Subscription {
  id: string
  status: string
  pm_type: string
  pm_brand: string
  pm_last4: string
  price_id: string
  current_period_end: string
  current_period_start: string
}

interface PendingSeller {
  id: string
  company_name: string
  watch_pros_name: string
  company_status: string
  first_name: string
  last_name: string
  email: string
  country: string
  phone_prefix: string
  phone: string
  created_at: string
  updated_at: string
  id_card_front_url: string
  id_card_back_url: string
  proof_of_address_url: string
  user_id: string
  crypto_friendly: boolean
  company_logo_url: string
  identity_verified: boolean
  identity_rejected: boolean
  seller_addresses: SellerAddress[]
  profiles: Array<{
    subscriptions: Subscription[]
  }>
  subscriptions: Subscription[]
}

export function PendingIdentitiesTab() {
  const [pendingSellers, setPendingSellers] = useState<PendingSeller[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingSellers()
  }, [])

  const fetchPendingSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers')
      if (response.ok) {
        const data = await response.json()
        setPendingSellers(data.sellers || [])
      }
    } catch (error) {
      console.error('Error fetching pending sellers:', error)
      toast({
        title: "Error",
        description: "Failed to load pending identities",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (sellerId: string) => {
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          action: 'approve'
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Seller identity approved",
        })
        fetchPendingSellers() // Refresh the list
      } else {
        throw new Error('Failed to approve seller')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve seller identity",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (sellerId: string) => {
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          action: 'reject'
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Seller identity rejected",
        })
        fetchPendingSellers() // Refresh the list
      } else {
        throw new Error('Failed to reject seller')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject seller identity",
        variant: "destructive",
      })
    }
  }

  const openDocument = (url: string) => {
    setSelectedDocument(url)
    setIsDocumentModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
  }

  const getCountryLabel = (countryCode: string) => {
    const country = countries.find(c => c.value === countryCode)
    return country ? country.label : countryCode
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const pendingSellersList = pendingSellers.filter(seller => 
    !seller.identity_verified && !seller.identity_rejected
  )

  if (pendingSellersList.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Identities</h3>
            <p>All seller identities have been reviewed.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {pendingSellersList.length} vendeur{pendingSellersList.length > 1 ? 's' : ''} en attente de validation
          </h3>
          <p className="text-muted-foreground">
            Review and approve seller identity documents
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPendingSellers}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </Button>
      </div>

      <div className="space-y-6">
        {pendingSellersList.map((seller) => {
          const address = seller.seller_addresses[0]
          const subscription = seller.subscriptions[0]
          
          return (
            <Card key={seller.id} className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {seller.company_logo_url && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border">
                        <Image
                          src={seller.company_logo_url}
                          alt={`${seller.company_name} logo`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">{seller.company_name}</CardTitle>
                      <p className="text-muted-foreground">@{seller.watch_pros_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(seller.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(seller.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Informations de contact
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact principal</p>
                        <p className="font-medium">{seller.first_name} {seller.last_name}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{seller.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{seller.phone_prefix} {seller.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {getCountryFlag(seller.country)} {getCountryLabel(seller.country)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legal Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informations légales
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Statut de l'entreprise</p>
                        <p className="font-medium">{seller.company_status}</p>
                      </div>
                      
                      {address && (
                        <>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">SIREN</p>
                            <p className="font-medium">{address.siren}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Numéro fiscal</p>
                            <p className="font-medium">{address.tax_id}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Numéro de TVA</p>
                            <p className="font-medium">{address.vat_number}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                            <p className="font-medium">
                              {address.street}<br />
                              {address.postal_code} {address.city}<br />
                              {getCountryFlag(address.country)} {getCountryLabel(address.country)}
                            </p>
                          </div>
                          
                          {address.website && (
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Site web</p>
                              <a 
                                href={address.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-1"
                              >
                                {address.website}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents (cliquable pour afficher le document)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {seller.id_card_front_url && (
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocument(seller.id_card_front_url)}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">Carte d'identité (recto)</span>
                      </Button>
                    )}
                    
                    {seller.id_card_back_url && (
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocument(seller.id_card_back_url)}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">Carte d'identité (verso)</span>
                      </Button>
                    )}
                    
                    {seller.proof_of_address_url && (
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => openDocument(seller.proof_of_address_url)}
                      >
                        <Eye className="h-5 w-5" />
                        <span className="text-sm">Justificatif de domicile</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subscription Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Informations de souscription
                  </h4>
                  
                  {subscription && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Statut</p>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Méthode de paiement</p>
                          <p className="font-medium">
                            {subscription.pm_brand?.toUpperCase()} •••• {subscription.pm_last4}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Début de période</p>
                          <p className="font-medium">{formatDate(subscription.current_period_start)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Fin de période</p>
                          <p className="font-medium">{formatDate(subscription.current_period_end)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Inscription le {formatDate(seller.created_at)}</p>
                    </div>
                    
                    {seller.crypto_friendly && (
                      <Badge variant="outline" className="border-amber-500 text-amber-500 bg-amber-500/10">
                        <Coins className="h-3 w-3 mr-1" />
                        Accepte les cryptos
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Document Modal */}
      <Dialog open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="flex justify-center">
              <Image
                src={selectedDocument}
                alt="Document"
                width={800}
                height={600}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 