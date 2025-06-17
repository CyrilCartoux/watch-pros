"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, User, Briefcase, ShieldCheck, Tag, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStatus } from "@/hooks/useAuthStatus"

export function Hero() {
  const { isAuthenticated, isSeller, isVerified, hasActiveSubscription } = useAuthStatus()
  return (
    <section
      aria-label="Hero section – B2B Watch Marketplace for Professionals"
      className="relative flex flex-col items-center justify-center min-h-[420px] md:min-h-[600px] px-4 py-12 md:py-24 bg-background"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-6xl font-extrabold tracking-tight text-center mb-4 md:mb-6 text-primary"
      >
        The B2B Marketplace<br className="hidden md:block" /> for Watch Professionals
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-base md:text-2xl text-muted-foreground text-center max-w-xl mx-auto mb-8 md:mb-12 font-normal"
      >
        Buy and sell luxury watches with trusted professionals. No commission. 100% B2B. Simple. Secure.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full flex justify-center"
      >
        <Link href="/auth" passHref>
          <Button
            size="lg"
            className="h-12 px-8 text-base md:text-lg font-semibold shadow-md"
            title="Connect to the platform"
            aria-label="Connect to the platform"
          >
            Connect to the platform
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </Link>
      </motion.div>

      {/* Steps section */}
      <div className="w-full max-w-4xl mx-auto mt-10 md:mt-16 px-2 md:px-0">
        <ol className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center text-center p-4 rounded-xl transition hover:bg-muted/60"
          >
            <div className="flex flex-col items-center mb-2 relative">
              <User className="w-7 h-7 text-primary mb-1" />
              {isAuthenticated && (
                <CheckCircle2 className="w-5 h-5 text-green-500 absolute -top-2 -right-2 bg-background rounded-full" />
              )}
            </div>
            <span className="font-semibold mb-1">Connect to the platform</span>
            {!isAuthenticated && (
              <Link href="/auth" passHref>
                <Button variant="link" className="p-0 h-auto text-primary font-medium">Sign in / Sign up</Button>
              </Link>
            )}
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center text-center p-4 rounded-xl transition hover:bg-muted/60"
          >
            <div className="flex flex-col items-center mb-2 relative">
              <Briefcase className="w-7 h-7 text-primary mb-1" />
              {isSeller && (
                <CheckCircle2 className="w-5 h-5 text-green-500 absolute -top-2 -right-2 bg-background rounded-full" />
              )}
            </div>
            <span className="font-semibold mb-1">Create your seller account</span>
            {!isSeller && (
              <Link href="/register" passHref>
                <Button variant="link" className="p-0 h-auto text-primary font-medium">Register as seller</Button>
              </Link>
            )}
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center text-center p-4 rounded-xl transition hover:bg-muted/60"
          >
            <div className="flex flex-col items-center mb-2 relative">
              <ShieldCheck className="w-7 h-7 text-primary mb-1" />
              {isVerified && (
                <CheckCircle2 className="w-5 h-5 text-green-500 absolute -top-2 -right-2 bg-background rounded-full" />
              )}
            </div>
            <span className="font-semibold mb-1">Wait for verification</span>
            <span className="text-sm text-muted-foreground">We verify all professionals for a secure marketplace.</span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="flex flex-col items-center text-center p-4 rounded-xl transition hover:bg-muted/60"
          >
            <div className="flex flex-col items-center mb-2 relative">
              <Tag className="w-7 h-7 text-primary mb-1" />
              {hasActiveSubscription && (
                <CheckCircle2 className="w-5 h-5 text-green-500 absolute -top-2 -right-2 bg-background rounded-full" />
              )}
            </div>
            <span className="font-semibold mb-1">Sell your watches</span>
            <span className="text-sm text-muted-foreground">List and sell to trusted professionals worldwide.</span>
          </motion.li>
        </ol>
      </div>
    </section>
  )
}
