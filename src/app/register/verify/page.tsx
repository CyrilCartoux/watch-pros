"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type PaymentStatus = 'processing' | 'succeeded' | 'failed' | 'error'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>('processing')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    const clientSecret = searchParams.get('payment_intent_client_secret')
    const redirectStatus = searchParams.get('redirect_status')
    
    if (!paymentIntent || !clientSecret) {
      setStatus('error')
      setError('No payment information found')
      return
    }

    // Verify payment status
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_intent: paymentIntent,
        payment_intent_client_secret: clientSecret,
        redirect_status: redirectStatus
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus('error')
          setError(data.error)
        } else {
          // Use redirect_status if available, otherwise fallback to payment intent status
          const finalStatus = data.redirect_status || data.status
          switch (finalStatus) {
            case 'succeeded':
              setStatus('succeeded')
              break
            case 'processing':
              setStatus('processing')
              break
            default:
              setStatus('failed')
              setError('Payment failed. Please try again.')
          }
        }
      })
      .catch((err) => {
        setStatus('error')
        setError('Failed to verify payment status')
      })
  }, [searchParams])

  const getStatusContent = () => {
    switch (status) {
      case 'succeeded':
        return {
          icon: <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />,
          title: "Payment successful!",
          description: "Your payment has been processed successfully. Your account will be activated after verification by our team.",
          nextSteps: true
        }
      case 'processing':
        return {
          icon: <Clock className="w-20 h-20 text-primary mx-auto" />,
          title: "Payment processing",
          description: "We are currently processing your payment. This may take a few minutes.",
          nextSteps: false
        }
      case 'failed':
        return {
          icon: <XCircle className="w-20 h-20 text-red-500 mx-auto" />,
          title: "Payment failed",
          description: error || "There was an issue with your payment. Please try again.",
          nextSteps: false
        }
      default:
        return {
          icon: <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />,
          title: "Something went wrong",
          description: error || "An unexpected error occurred. Please contact support.",
          nextSteps: false
        }
    }
  }

  const statusContent = getStatusContent()

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
                {statusContent.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-3xl font-bold tracking-tight">
                  {statusContent.title}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {statusContent.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {statusContent.nextSteps && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h2 className="font-semibold mb-2">Next steps:</h2>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Our team verifies your documents and information</li>
                      <li>• You will receive a confirmation email once your account is validated</li>
                      <li>• You can then start publishing your listings</li>
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Back home
                    </Button>
                  </Link>
                  {status === 'failed' && (
                    <Link href="/register/form">
                      <Button className="w-full sm:w-auto">
                        Try again
                      </Button>
                    </Link>
                  )}
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