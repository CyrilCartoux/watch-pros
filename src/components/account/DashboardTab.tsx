"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export function DashboardTab() {
  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vues totales</CardTitle>
            <CardDescription>Sur toutes vos annonces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">+12% ce mois-ci</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription>Messages reçus</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">+5% ce mois-ci</p>
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

      {/* Volume de commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Volume de commandes</CardTitle>
          <CardDescription>Historique des ventes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">45,678 €</p>
              </div>
              <div>
                <p className="text-sm font-medium">Ce mois</p>
                <p className="text-2xl font-bold">12,345 €</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cette année</p>
                <p className="text-2xl font-bold">34,567 €</p>
              </div>
            </div>
            {/* TODO: Ajouter un graphique d'évolution */}
          </div>
        </CardContent>
      </Card>

      {/* Avis et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Avis et recommandations</CardTitle>
          <CardDescription>Votre réputation sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-primary text-primary" />
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Basé sur 123 avis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Vouch reçus :</p>
              <p className="text-sm text-muted-foreground">12 vendeurs vous recommandent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 