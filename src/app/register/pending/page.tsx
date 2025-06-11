"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PendingPage() {
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
                <Clock className="w-20 h-20 text-primary mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-bold tracking-tight">
                  Your registration is being processed
                </h1>
                <p className="text-muted-foreground text-lg">
                  Our team is currently reviewing your application.
                  This process usually takes 24-48 hours.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="bg-muted/50 rounded-lg p-4">
                  <h2 className="font-semibold mb-2">What happens next?</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Our team verifies your documents and information</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>You will receive a confirmation email once your account is validated</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>You can then start publishing your listings</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Back home
                    </Button>
                  </Link>
                  <Link href="/help">
                    <Button className="w-full sm:w-auto">
                      Contact support
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