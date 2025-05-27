"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SuccessPage() {
  return (
    <main className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
              >
                <CheckCircle2 className="w-20 h-20 text-primary mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-bold tracking-tight">
                  Votre compte a été créé avec succès !
                </h1>
                <p className="text-muted-foreground text-lg">
                  Votre compte sera activé après vérification par notre équipe.
                  Ce processus prend généralement moins de 24 heures.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="bg-muted/50 rounded-lg p-4">
                  <h2 className="font-semibold mb-2">Prochaines étapes :</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Notre équipe vérifie vos documents et informations</li>
                    <li>• Vous recevrez un email de confirmation une fois votre compte validé</li>
                    <li>• Vous pourrez alors commencer à publier vos annonces</li>
                    <li>• Pendant la période d'essai, vous pourrez publier jusqu'à 5 annonces</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Retour au tableau de bord
                    </Button>
                  </Link>
                  <Link href="/sell">
                    <Button className="w-full sm:w-auto">
                      Commencer à vendre
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
} 