'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Seller } from '@/types/db/Sellers'
import { SellerAddress } from '@/types/db/SellerAddresses'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'

type SellerWithAddress = Seller & {
  seller_addresses: SellerAddress[]
}

export default function AdminPage() {
  const [pendingSellers, setPendingSellers] = useState<SellerWithAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [processingSeller, setProcessingSeller] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
    return date.toLocaleDateString('fr-FR', options)
  }

  const getCompanyStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth')
        return
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role !== 'admin') {
        router.push('/')
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page",
        })
        return
      }

      fetchPendingSellers()
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/')
    }
  }

  const fetchPendingSellers = async () => {
    try {
      const response = await fetch('/api/admin/sellers')
      if (!response.ok) {
        throw new Error('Failed to fetch sellers')
      }
      const data = await response.json()
      setPendingSellers(data.sellers || [])
    } catch (error) {
      console.error('Error fetching pending sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (sellerId: string) => {
    try {
      setProcessingSeller(sellerId)
      const response = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          action: 'approve',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve seller')
      }

      toast({
        title: "Succès",
        description: "Le vendeur a été approuvé avec succès",
      })
      fetchPendingSellers()
    } catch (error) {
      console.error('Error approving seller:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'approbation du vendeur",
      })
    } finally {
      setProcessingSeller(null)
    }
  }

  const handleDecline = async (sellerId: string) => {
    try {
      setProcessingSeller(sellerId)
      const response = await fetch('/api/admin/sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sellerId,
          action: 'decline',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to decline seller')
      }

      toast({
        title: "Succès",
        description: "Le vendeur a été rejeté avec succès",
      })
      fetchPendingSellers()
    } catch (error) {
      console.error('Error declining seller:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du rejet du vendeur",
      })
    } finally {
      setProcessingSeller(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              {pendingSellers.length} vendeurs en attente de validation
            </p>
          </div>
          <button
            onClick={fetchPendingSellers}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>

        <div className="grid gap-6">
          {pendingSellers.map((seller) => (
            <div key={seller.id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    {seller.company_logo_url ? (
                      <img
                        src={seller.company_logo_url}
                        alt={`${seller.company_name} logo`}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl text-gray-500">{seller.company_name[0]}</span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{seller.company_name}</h2>
                      <p className="text-sm text-gray-500">@{seller.watch_pros_name}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={processingSeller === seller.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingSeller === seller.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approuver
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDecline(seller.id)}
                      disabled={processingSeller === seller.id}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingSeller === seller.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Rejeter
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informations de contact</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-1 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contact principal</dt>
                          <dd className="mt-1 text-sm text-gray-900">{seller.first_name} {seller.last_name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Email</dt>
                          <dd className="mt-1 text-sm text-gray-900">{seller.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                          <dd className="mt-1 text-sm text-gray-900">+{seller.phone_prefix} {seller.phone}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Pays</dt>
                          <dd className="mt-1 text-sm text-gray-900">{seller.country}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informations légales</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <dl className="grid grid-cols-1 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Statut de l'entreprise</dt>
                          <dd className="mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCompanyStatusColor(seller.company_status)}`}>
                              {seller.company_status}
                            </span>
                          </dd>
                        </div>
                        {seller.seller_addresses?.[0]?.siren && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">SIREN</dt>
                            <dd className="mt-1 text-sm text-gray-900">{seller.seller_addresses[0].siren}</dd>
                          </div>
                        )}
                        {seller.seller_addresses?.[0]?.tax_id && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Numéro fiscal</dt>
                            <dd className="mt-1 text-sm text-gray-900">{seller.seller_addresses[0].tax_id}</dd>
                          </div>
                        )}
                        {seller.seller_addresses?.[0]?.vat_number && (
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Numéro de TVA</dt>
                            <dd className="mt-1 text-sm text-gray-900">{seller.seller_addresses[0].vat_number}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-4">
                        {seller.id_card_front_url && (
                          <a
                            href={seller.id_card_front_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Carte d'identité (recto)
                          </a>
                        )}
                        {seller.id_card_back_url && (
                          <a
                            href={seller.id_card_back_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Carte d'identité (verso)
                          </a>
                        )}
                        {seller.proof_of_address_url && (
                          <a
                            href={seller.proof_of_address_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Justificatif de domicile
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                  <div>
                    <span>Inscription le </span>
                    <time dateTime={seller.created_at}>
                      {formatDate(seller.created_at)}
                    </time>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seller.crypto_friendly ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {seller.crypto_friendly ? 'Accepte les cryptos' : 'N\'accepte pas les cryptos'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 