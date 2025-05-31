import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

interface SellCTAProps {
  className?: string
  title?: string
  description?: string
}

export function SellCTA({ 
  className = "",
  title = "Want to sell your watches?",
  description = "Join our community of professional sellers and grow your business internationally"
}: SellCTAProps) {
  return (
    <section className={`py-16 bg-muted/50 ${className}`}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Professional Seller</h3>
                    <p className="text-sm text-muted-foreground">
                      Access to our B2B platform
                    </p>
                  </div>
                </div>
                <Link href="/register">
                  <Button className="w-full">
                    Create a professional account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Already registered?</h3>
                    <p className="text-sm text-muted-foreground">
                      Post your first listing
                    </p>
                  </div>
                </div>
                <Link href="/sell">
                  <Button className="w-full">
                    List a watch for sale
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}