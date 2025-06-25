"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, EyeOff, Mail, Phone, MessageSquare, MapPin, Euro, Calendar, Search, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Brand {
  id: string
  slug: string
  label: string
}

interface Model {
  id: string
  slug: string
  label: string
}

interface ActiveSearch {
  id: string
  title: string
  description: string | null
  type: 'watch' | 'accessory'
  brand: Brand | null
  model: Model | null
  reference: string | null
  dial_color: string | null
  max_price: number | null
  location: string | null
  accessory_type: string | null
  is_public: boolean
  is_active: boolean
  contact_preferences: {
    email: boolean
    phone: boolean
    whatsapp: boolean
  }
  created_at: string
  updated_at: string
}

export function ActiveSearchesTab() {
  const [activeSearches, setActiveSearches] = useState<ActiveSearch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchToDelete, setSearchToDelete] = useState<ActiveSearch | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchActiveSearches()
  }, [])

  const fetchActiveSearches = async () => {
    try {
      const response = await fetch('/api/search/me')
      if (!response.ok) {
        throw new Error('Failed to fetch active searches')
      }
      const data = await response.json()
      setActiveSearches(data)
    } catch (error) {
      console.error('Error fetching active searches:', error)
      toast({
        title: "Error",
        description: "Failed to load your active searches",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const openDeleteDialog = (search: ActiveSearch) => {
    setSearchToDelete(search)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setSearchToDelete(null)
  }

  const handleDeleteSearch = async () => {
    if (!searchToDelete) return

    try {
      const response = await fetch(`/api/search/${searchToDelete.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete active search')
      }

      setActiveSearches(prev => prev.filter(search => search.id !== searchToDelete.id))
      toast({
        title: "Success",
        description: "Active search deleted successfully"
      })
      closeDeleteDialog()
    } catch (error) {
      console.error('Error deleting active search:', error)
      toast({
        title: "Error",
        description: "Failed to delete active search",
        variant: "destructive"
      })
    }
  }

  const getCountryLabel = (countryCode: string | null) => {
    if (!countryCode) return null
    const countries = [
      { value: 'FR', label: 'France', flag: '🇫🇷' },
      { value: 'US', label: 'United States', flag: '🇺🇸' },
      { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
      { value: 'DE', label: 'Germany', flag: '🇩🇪' },
      { value: 'IT', label: 'Italy', flag: '🇮🇹' },
      { value: 'ES', label: 'Spain', flag: '🇪🇸' },
      { value: 'CH', label: 'Switzerland', flag: '🇨🇭' },
      { value: 'BE', label: 'Belgium', flag: '🇧🇪' },
      { value: 'NL', label: 'Netherlands', flag: '🇳🇱' },
      { value: 'CA', label: 'Canada', flag: '🇨🇦' }
    ]
    const country = countries.find(c => c.value === countryCode)
    return country ? `${country.flag} ${country.label}` : countryCode
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeSearches.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Active Searches</h3>
        <p className="text-muted-foreground mb-6">
          You haven't created any active searches yet. Create one to let sellers know what you're looking for.
        </p>
        <Button onClick={() => router.push('/search/create')}>
          Create Search
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Searches</h2>
            <p className="text-muted-foreground">
              Manage your active searches and contact preferences
            </p>
          </div>
          <Button onClick={() => router.push('/search/create')}>
            Create New Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSearches.map((search) => (
            <Card key={search.id} className="relative flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate">
                      {search.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {search.type === 'watch' ? 'Watch' : 'Accessory'} • {formatDate(search.created_at)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {search.is_public ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    )}
                    {!search.is_active && (
                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 flex flex-col">
                {search.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {search.description}
                  </p>
                )}

                <div className="space-y-2 flex-1">
                  {search.brand && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Brand:</span>
                      <span>{search.brand.label}</span>
                    </div>
                  )}
                  
                  {search.model && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Model:</span>
                      <span>{search.model.label}</span>
                    </div>
                  )}

                  {search.reference && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Reference:</span>
                      <span>{search.reference}</span>
                    </div>
                  )}

                  {search.dial_color && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Dial:</span>
                      <span>{search.dial_color}</span>
                    </div>
                  )}

                  {search.accessory_type && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Type:</span>
                      <span>{search.accessory_type}</span>
                    </div>
                  )}

                  {search.max_price && (
                    <div className="flex items-center gap-2 text-sm">
                      <Euro className="h-3 w-3" />
                      <span>Max: €{search.max_price.toLocaleString()}</span>
                    </div>
                  )}

                  {search.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{getCountryLabel(search.location)}</span>
                    </div>
                  )}
                </div>

                {/* Contact Preferences */}
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Contact Methods:</p>
                  <div className="flex gap-2">
                    {search.contact_preferences.email && (
                      <Badge variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Badge>
                    )}
                    {search.contact_preferences.phone && (
                      <Badge variant="outline" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Phone
                      </Badge>
                    )}
                    {search.contact_preferences.whatsapp && (
                      <Badge variant="outline" className="text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        WhatsApp
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions - Always at the bottom */}
                <div className="flex gap-2 pt-3 border-t mt-auto">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="w-full"
                    onClick={() => openDeleteDialog(search)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Active Search</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{searchToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSearch}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 