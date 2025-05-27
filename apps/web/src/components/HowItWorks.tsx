"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, Search, Bell, Shield, Clock, MessageSquare } from "lucide-react"

const features = [
  {
    title: "Recherche avancée",
    description: "Filtrez par marque, modèle, état, pays et disponibilité immédiate. Trouvez exactement ce que vous cherchez en quelques clics.",
    icon: Search,
  },
  {
    title: "Vérification des vendeurs",
    description: "Système de notation et badges de confiance pour garantir la fiabilité des transactions. KYC professionnel pour tous les vendeurs.",
    icon: Shield,
  },
  {
    title: "Alertes personnalisées",
    description: "Recevez des notifications instantanées quand un modèle recherché devient disponible. Ne manquez plus aucune opportunité.",
    icon: Bell,
  },
  {
    title: "Disponibilité en temps réel",
    description: "Voir instantanément si une montre est disponible, sans perdre de temps en messages inutiles.",
    icon: Clock,
  },
  {
    title: "Communication intégrée",
    description: "Échangez directement sur la plateforme ou via WhatsApp/Telegram. Gardez un historique de toutes vos conversations.",
    icon: MessageSquare,
  },
  {
    title: "Badges professionnels",
    description: "Validez votre statut de professionnel et gagnez la confiance des acheteurs avec des badges de vérification.",
    icon: BadgeCheck,
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Pourquoi choisir Watch Pros ?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une plateforme conçue par des professionnels, pour les professionnels. Plus efficace que WhatsApp, plus accessible que Chrono24.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 