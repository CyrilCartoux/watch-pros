"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageSquare, Clock, Shield, TrendingUp, Users, Target, Zap, Globe, Award, Search, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const problems = [
  {
    title: "Coûts élevés des plateformes existantes",
    description: "Les abonnements et commissions des plateformes actuelles représentent un coût significatif pour les professionnels.",
    icon: TrendingUp,
  },
  {
    title: "Désorganisation des groupes WhatsApp",
    description: "Pas de filtres, informations non structurées, disponibilité incertaine et perte de temps considérable.",
    icon: MessageSquare,
  },
  {
    title: "Communication inefficace",
    description: "Pas de moteur de recherche, pas d'historique ou de réputation fiable, échanges 1:1 chronophages.",
    icon: Users,
  },
]

const solutions = [
  {
    title: "Plateforme B2B dédiée",
    description: "Une solution professionnelle conçue spécifiquement pour les besoins des professionnels de l'horlogerie.",
    icon: Shield,
  },
  {
    title: "Gain de temps significatif",
    description: "Recherche avancée, disponibilité en temps réel et communication intégrée pour optimiser vos échanges.",
    icon: Clock,
  },
  {
    title: "Communauté de confiance",
    description: "Système de vérification et badges professionnels pour garantir la fiabilité des transactions.",
    icon: Users,
  },
]

const stats = [
  {
    value: "70%",
    label: "de temps gagné",
    description: "sur la gestion des ventes",
  },
  {
    value: "24h",
    label: "de délai moyen",
    description: "pour la vérification des annonces",
  },
  {
    value: "100%",
    label: "des vendeurs",
    description: "vérifiés professionnellement",
  },
]

const values = [
  {
    title: "Innovation",
    description: "Nous repensons constamment notre plateforme pour offrir les meilleures solutions aux professionnels de l'horlogerie.",
    icon: Zap,
  },
  {
    title: "Confiance",
    description: "La sécurité et la fiabilité sont au cœur de notre démarche, avec un système de vérification rigoureux.",
    icon: Shield,
  },
  {
    title: "Efficacité",
    description: "Notre objectif est de faire gagner du temps aux professionnels en automatisant les tâches chronophages.",
    icon: Target,
  },
  {
    title: "Accessibilité",
    description: "Nous rendons le commerce B2B des montres de luxe accessible à tous les professionnels, quelle que soit leur taille.",
    icon: Globe,
  },
]

const features = [
  {
    title: "Recherche avancée",
    description: "Filtrez par marque, modèle, état, pays et disponibilité immédiate.",
    icon: Search,
  },
  {
    title: "Alertes personnalisées",
    description: "Recevez des notifications instantanées sur les modèles recherchés.",
    icon: Bell,
  },
  {
    title: "Communication intégrée",
    description: "Échangez directement sur la plateforme ou via WhatsApp/Telegram.",
    icon: MessageSquare,
  },
  {
    title: "Badges professionnels",
    description: "Validez votre statut et gagnez la confiance des acheteurs.",
    icon: Award,
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
                Notre Vision
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
                Révolutionner le commerce B2B des montres de luxe en offrant une plateforme professionnelle, efficace et accessible.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Rejoindre Watch Pros
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    Nous contacter
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 md:p-0"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-base md:text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problèmes */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Les Défis du Marché
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Nous avons identifié les principaux obstacles auxquels font face les professionnels de l'horlogerie.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <problem.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{problem.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Nos Solutions
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Des réponses concrètes aux défis du marché, conçues pour les professionnels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-background h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <solution.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{solution.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Fonctionnalités Clés
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Des outils puissants pour optimiser votre activité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Nos Valeurs
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Les principes qui guident notre action au quotidien.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-background">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{value.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">
              Prêt à rejoindre la révolution ?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
              Rejoignez la communauté de professionnels qui transforment déjà leur façon de faire du commerce.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 