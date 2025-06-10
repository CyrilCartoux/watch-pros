"use client"

import Head from "next/head"                            
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, PlusCircle, ArrowRight } from "lucide-react"   
import Link from "next/link"

interface SellCTAProps {
  className?: string
  title?: string
  description?: string
}

export function SellCTA({
  className = "",
  title = "Prêt à libérer le potentiel de votre business horloger ?", // 🎯 Titre plus engageant
  description = "Rejoignez Watch Pros, la place de marché B2B pour montres de luxe : visibilité mondiale et zéro commission."
}: SellCTAProps) {
  return (
    <>
      <Head>
        <title>Sell Your Luxury Watches | Join Watch Pros B2B Marketplace</title>
        <meta
          name="description"
          content="Rejoignez Watch Pros, la place de marché B2B pour montres de luxe : sans commission, vendeurs vérifiés et visibilité mondiale. Commencez à vendre dès aujourd’hui !"
        />
        <link rel="canonical" href="https://votresite.com/sell" />
      </Head>

      <section className={`py-16 bg-muted/50 ${className}`} aria-labelledby="sell-cta-title">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* — Titre H2 optimisé */}
            <h2 id="sell-cta-title" className="text-3xl font-bold tracking-tight">
              {title}
            </h2>
            {/* — Description fractionnée pour plus de lisibilité */}
            <p className="text-lg text-muted-foreground">
              {description.split(" : ")[0]}.
              <br />
              {description.split(" : ")[1]}.
            </p>

            {/* — Micro-preuve sociale */}
            <p className="italic text-sm text-muted-foreground">
              Déjà plus de <strong>500</strong> vendeurs professionnels actifs.
            </p>

            {/* — Choix d’actions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Carte 1 : Create account */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Create Professional Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Accédez à notre plateforme B2B et démarrez vos ventes.
                      </p>
                    </div>
                  </div>
                  <Link href="/register" passHref>
                    <Button
                      className="w-full"
                      title="Start Selling Luxury Watches"
                      aria-label="Start Selling Luxury Watches"
                    >
                      Start Selling{" "}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Carte 2 : Post listing */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <PlusCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">Post Your First Listing</h3>
                      <p className="text-sm text-muted-foreground">
                        Mettez en ligne votre première montre en quelques clics.
                      </p>
                    </div>
                  </div>
                  <Link href="/sell" passHref>
                    <Button
                      variant="outline"
                      className="w-full"
                      title="Post Your First Listing"
                      aria-label="Post Your First Listing"
                    >
                      Post Listing{" "}
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
