'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <Button asChild variant="outline">
        <Link href="/">
          Return home
        </Link>
      </Button>
    </div>
  )
} 