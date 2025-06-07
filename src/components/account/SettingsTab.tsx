"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Coins, Shield, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { countries } from "@/data/form-options"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  seller_id: string | null
}

interface SellerAccount {
  companyName: string
  companyLogo: string | null
  watchProsName: string
  companyStatus: string
  firstName: string
  lastName: string
  email: string
  country: string
  title: string
  phonePrefix: string
  phone: string
  cryptoFriendly: boolean
}

interface SellerAddress {
  street: string
  city: string
  country: string
  postalCode: string
  website: string
  siren: string
  taxId: string
  vatNumber: string
}

interface Seller {
  id: string
  account: SellerAccount
  address: SellerAddress | null
  stats: {
    totalReviews: number
    averageRating: number
    lastUpdated: string
  }
}

function SettingsTabSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo and Info Skeleton */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Address Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40 mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Save Button Skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}

export function SettingsTab() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [seller, setSeller] = useState<Seller | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        
        // Fetch user profile
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not found')

        const response = await fetch(`/api/profiles/${user.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }
        const profileData = await response.json()
        setProfile(profileData)

        // If user is a seller, fetch seller data from API
        if (profileData.seller_id) {
          const response = await fetch(`/api/sellers/${profileData.seller_id}`)
          if (!response.ok) {
            throw new Error('Failed to fetch seller data')
          }
          const sellerData = await response.json()
          setSeller(sellerData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    if (seller) {
      setSeller(prev => prev ? {
        ...prev,
        account: {
          ...prev.account,
          [field]: value
        }
      } : null)
    } else {
      setProfile(prev => prev ? {
        ...prev,
        [field]: value
      } : null)
    }
  }

  const handleAddressChange = (field: string, value: string) => {
    if (seller && seller.address) {
      setSeller(prev => {
        if (!prev || !prev.address) return prev
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          } as SellerAddress
        }
      })
    }
  }

  const handleUpdate = async () => {
    if (!seller) return

    setIsUpdating(true)
    setError(null)
    setShowSuccess(false)

    try {
      const response = await fetch(`/api/sellers/${seller.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: {
            companyName: seller.account.companyName,
            companyLogo: seller.account.companyLogo,
            watchProsName: seller.account.watchProsName,
            companyStatus: seller.account.companyStatus,
            firstName: seller.account.firstName,
            lastName: seller.account.lastName,
            email: seller.account.email,
            country: seller.account.country,
            title: seller.account.title,
            phonePrefix: seller.account.phonePrefix,
            phone: seller.account.phone,
            cryptoFriendly: seller.account.cryptoFriendly
          },
          address: seller.address ? {
            street: seller.address.street,
            city: seller.address.city,
            country: seller.address.country,
            postalCode: seller.address.postalCode,
            website: seller.address.website
          } : undefined
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update seller')
      }

      const updatedSeller = await response.json()
      setSeller(updatedSeller)
      setShowSuccess(true)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
        variant: "default",
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating your profile'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) return <SettingsTabSkeleton />
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>No profile found</div>

  return (
    <div className="space-y-6">
      {/* Profil */}
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informations de votre compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {seller && (
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
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
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{seller.account.companyName}</h2>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">
                    <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="font-medium">Verified</span>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{seller.account.companyStatus}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
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
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                value={seller?.account.firstName || profile.first_name || ''}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={seller?.account.lastName || profile.last_name || ''}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {seller && (
            <div className="space-y-2">
              <Label>Nom de l'entreprise</Label>
              <Input
                value={seller.account.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adresse */}
      {seller && seller.address && (
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
            <CardDescription>Adresse de votre entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Rue</Label>
              <Input
                value={seller.address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input
                  value={seller.address.postalCode}
                  onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  value={seller.address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site web</Label>
              <Input
                value={seller.address.website}
                onChange={(e) => handleAddressChange("website", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>SIREN</Label>
                <Input
                  value={seller.address.siren}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Numéro TVA</Label>
                <Input
                  value={seller.address.vatNumber}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Tax ID</Label>
                <Input
                  value={seller.address.taxId}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
          <CardDescription>Informations de contact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Adresse e-mail</Label>
            <Input
              type="email"
              value={seller?.account.email || profile.email || ''}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          {seller && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Indicatif téléphonique</Label>
                  <Input
                    value={seller.account.phonePrefix}
                    onChange={(e) => handleInputChange("phonePrefix", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={seller.account.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input
                  value={seller.account.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Mot de passe</Label>
            <Input
              type="password"
              value="********"
              disabled
              className="bg-muted"
            />
            <Button variant="outline" className="mt-2">
              Modifier le mot de passe
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span>Profile updated successfully</span>
          </div>
        )}
        <Button 
          onClick={handleUpdate}
          disabled={isUpdating}
          className="min-w-[200px]"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
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