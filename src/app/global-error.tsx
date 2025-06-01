'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold">Something went wrong!</h2>
          <Button
            onClick={() => reset()}
            variant="outline"
          >
            Try again
          </Button>
        </div>
      </body>
    </html>
  )
} 