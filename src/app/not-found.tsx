import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="max-w-[500px] text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">
            Return home
          </Link>
        </Button>
        <Button asChild>
          <Link href="/listings">
            Browse listings
          </Link>
        </Button>
      </div>
    </div>
  )
} 