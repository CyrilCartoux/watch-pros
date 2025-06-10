"use client"

import Head from "next/head"                        
import { Card, CardContent } from "@/components/ui/card"
import { Search, Bell, Shield, Clock, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Recherche ultra-ciblée",
    description: "Trouvez la montre idéale en quelques clics : filtrez par marque, modèle, état et disponibilité immédiate.",
    icon: Search,
  },
  {
    title: "Vendeurs vérifiés",
    description: "Trust badges et KYC pro pour garantir la fiabilité de chaque transaction.",
    icon: Shield,
  },
  {
    title: "Alertes en temps réel",
    description: "Recevez une notification instantanée quand votre modèle recherché est en ligne.",
    icon: Bell,
  },
  {
    title: "Disponibilité instantanée",
    description: "Visualisez en un coup d’œil les montres disponibles, sans aller-retour de messages.",
    icon: Clock,
  },
  {
    title: "Tarification transparente",
    description: "Abonnement mensuel clair, zéro commission : conservez 100 % de vos ventes.",
    icon: CreditCard,
  },
]

export function HowItWorks() {
  return (
    <>
      <Head>
        <title>Why Choose Watch Pros? Leading Luxury B2B Watch Marketplace</title>
        <meta
          name="description"
          content="Découvrez Watch Pros, la référence B2B pour les montres de luxe : recherche avancée, vendeurs vérifiés, alertes en temps réel et tarification claire. Trouvez la montre parfaite dès maintenant !"
        />
        <link rel="canonical" href="https://votresite.com/how-it-works" />
      </Head>

      <section className="py-24">
        {/* — Micro-CTA en haut */}
        <div className="text-center mb-8">
          <p className="italic">Prêt à booster vos ventes de montres de luxe ?</p>
          <Link href="/pricing" passHref>
            <Button
              size="default"
              className="mt-4 gap-2"
              title="Voir nos offres et démarrer"
              aria-label="Voir nos offres et démarrer"
            >
              Voir nos offres et démarrer
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Why choose Watch Pros?
            </h2>
            <p className="text-base max-w-2xl mx-auto text-muted-foreground">
              Une plateforme pensée par et pour les pros : plus rapide que WhatsApp, plus simple que Chrono24.
            </p>
          </div>

          {/* — Features reformulées et structurées */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <Card key={i} className="border-none shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <feat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feat.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* — Statistique clé */}
          <div className="text-center mt-12 italic text-muted-foreground">
            Déjà plus de <strong>500</strong> professionnels nous font confiance.
          </div>

          {/* — CTA principal en fin de section */}
          <div className="text-center mt-12">
            <Link href="/pricing" passHref>
              <Button
                size="lg"
                className="gap-2"
                title="Voir nos offres et démarrer"
                aria-label="Voir nos offres et démarrer"
              >
                Voir nos offres et démarrer
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
