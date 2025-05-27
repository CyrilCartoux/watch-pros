"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Building2, User, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Inscription en tant que professionnel sur Watch Pros
          </h1>
          <p className="text-muted-foreground text-lg">
            Rejoignez notre communauté de professionnels et développez votre activité à l'international
          </p>
        </div>

        {/* Étapes d'inscription */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Créez votre compte professionnel</h3>
              </div>
              <p className="text-muted-foreground">
                Commencez tout d'abord par configurer vos identifiants d'accès à notre plateforme, soumettez-nous ensuite quelques données essentielles sur votre entreprise et enregistrez vos données bancaires.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Complétez vos données</h3>
              </div>
              <p className="text-muted-foreground">
                Avant de commencer, nous avons encore besoin de quelques documents sur vous et votre entreprise. Nous vérifions également ensemble quels numéros d'identification fiscale doivent être fournis.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Commencez votre période d'essai</h3>
              </div>
              <p className="text-muted-foreground">
                Une fois vos données et documents vérifiés, vous pourrez commencer votre période d'essai. Publiez des annonces et vendez vos montres dans le monde entier.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Informations légales */}
        <div className="bg-muted/50 rounded-lg p-6 mb-12">
          <p className="text-muted-foreground mb-6">
            La société Watch Pros étant basée en Allemagne, nous devons nous conformer à la législation européenne en vigueur. Cela signifie que nous avons besoin de certaines données sur votre entreprise. De cette manière, vous pourrez vous concentrer pleinement sur la vente de vos montres pendant votre période d'essai.
          </p>
        </div>

        {/* Documents requis */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Personne morale */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Personne morale</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Personne morale / Société de capitaux</p>
              <ul className="space-y-2">
                {[
                  "Numéro d'identification au registre du commerce",
                  "Extrait de registre du commerce",
                  "Numéro d'identification fiscale",
                  "Numéro de TVA",
                  "Coordonnées bancaires pour les paiements",
                  "Justificatif de domicile",
                  "Pièce d'identité",
                  "Statut juridique",
                  "Chrono24 shareholder declaration",
                  "DAC 7 : données requises",
                  "Informations sur la TVA"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Personne physique */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Personne physique</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Personne physique / Entrepreneur individuel</p>
              <ul className="space-y-2">
                {[
                  "Numéro d'identification fiscale",
                  "Numéro de TVA",
                  "Coordonnées bancaires pour les paiements",
                  "Justificatif de domicile",
                  "Pièce d'identité",
                  "Déclaration d'activité professionnelle",
                  "DAC 7 : données requises",
                  "Informations sur la TVA"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Conditions */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Conditions d'acceptation</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Nous ne pouvons accepter votre inscription que si vous remplissez les conditions suivantes :
            </p>
            <ul className="space-y-2">
              {[
                "Vous avez un commerce déclaré ou une entreprise inscrite au registre du commerce",
                "Votre inventaire comprend au moins 50 montres",
                "50 de vos montres coûtent au moins 2 000 € chacune"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Veuillez noter que nous nous réservons le droit de refuser des inscriptions.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="px-8">
            Créer mon compte
          </Button>
        </div>
      </div>
    </main>
  )
} 