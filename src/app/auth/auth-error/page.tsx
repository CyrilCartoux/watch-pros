'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/10 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md border-red-200 shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Authentication Error</CardTitle>
          </div>
          <CardDescription className="text-red-600/80">
            There was a problem with the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-sm text-red-600">
              Please try signing in again. If the problem persists, contact support.
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/auth">
                Return to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}