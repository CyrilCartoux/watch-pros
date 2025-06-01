"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const mockSales = [
  {
    id: 1,
    title: "Rolex Submariner 2023",
    price: 12500,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
    buyer: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    status: "completed",
    date: "2024-03-20",
    rating: 5
  },
  {
    id: 2,
    title: "Omega Seamaster 300M",
    price: 8900,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
    buyer: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    status: "pending",
    date: "2024-03-19"
  },
  {
    id: 3,
    title: "Tudor Black Bay 58",
    price: 4500,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
    buyer: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    status: "cancelled",
    date: "2024-03-18"
  }
]

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    label: "Vendu"
  },
  pending: {
    icon: Clock,
    color: "text-yellow-500",
    label: "En cours"
  },
  cancelled: {
    icon: AlertCircle,
    color: "text-red-500",
    label: "Annulé"
  }
}

export function SalesTab() {
  return (
    <div className="space-y-6">
      {/* Résumé des ventes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes totales</CardTitle>
            <CardDescription>Nombre de montres vendues</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm text-muted-foreground">+5 ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'affaires</CardTitle>
            <CardDescription>Total des ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45,678 €</p>
            <p className="text-sm text-muted-foreground">+12% ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Taux de conversion</CardTitle>
            <CardDescription>Vues vers ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">7.2%</p>
            <p className="text-sm text-muted-foreground">+2% ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des ventes */}
      <div className="space-y-4">
        {mockSales.map((sale) => {
          const status = statusConfig[sale.status as keyof typeof statusConfig]
          const StatusIcon = status.icon

          return (
            <Card key={sale.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={sale.image}
                      alt={sale.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium">{sale.title}</h3>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-5 w-5 ${status.color}`} />
                        <span className={`text-sm ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <p className="text-lg font-bold mt-1">{sale.price.toLocaleString()} €</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={sale.buyer.avatar}
                        alt={sale.buyer.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">{sale.buyer.name}</p>
                      <span className="text-sm text-muted-foreground">
                        • {new Date(sale.date).toLocaleDateString()}
                      </span>
                    </div>
                    {sale.status === "completed" && sale.rating && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Avis reçu : {sale.rating}/5
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 