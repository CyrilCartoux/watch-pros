import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms of Service - Watch Pros",
  description: "Terms of Service and Conditions of Use for Watch Pros platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Beta Early Access - June 2025
            </p>
            <Separator className="my-8" />
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">1. Platform Overview</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The platform (hereinafter "the Platform") is a service connecting watch industry professionals, exclusively reserved for professional watch dealers and resellers (hereinafter "Users").
                </p>
                <p>
                  The Platform is operated by [Your Company Name], in the process of incorporation.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">2. Beta Status and Testing Phase</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The Platform is currently in beta development phase and is subject to continuous improvements and adjustments.
                </p>
                <p>Consequently:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Some features may be incomplete or subject to future modifications.</li>
                  <li>Users access the Platform as part of a <span className="font-medium text-foreground">limited access Early Birds program</span>.</li>
                  <li>Participation in the early access program implies acceptance of these terms.</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">3. Professional Access Only</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Registration and use of the Platform are strictly reserved for watch industry professionals operating legally and possessing a valid SIRET number or business registration.
                </p>
                <p>
                  Each registration is subject to verification by the Platform team, which reserves the right to refuse or suspend any account that does not meet these criteria.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">4. Service Purpose</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The Platform is a <span className="font-medium text-foreground">connection and listing</span> tool.
                </p>
                <p>The Platform does not intervene in:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sales conclusion</li>
                  <li>Price setting</li>
                  <li>Payment management</li>
                  <li>Delivery or product quality</li>
                </ul>
                <p>
                  Transactions are concluded directly between Users under their full responsibility.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">5. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>The Platform disclaims any responsibility regarding:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The accuracy of published listings</li>
                  <li>Actual product availability</li>
                  <li>Proper execution of transactions between Users</li>
                  <li>Any commercial, financial, or legal dispute between Users</li>
                </ul>
                <p>
                  Users are solely responsible for verifying their counterparts.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">6. Beta Features</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Certain features (alerts, statistics, favorites, featured listings, rating system, etc.) are being progressively deployed and may evolve without notice.
                </p>
                <p>
                  Users accept that service interruptions or anomalies may occur as part of the Platform's continuous improvement.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">7. Confidentiality and Restricted Access</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Access to listings and published prices is strictly reserved for validated professional members.
                </p>
                <p>
                  Any attempt at scraping, data extraction, or external distribution without express written authorization is strictly prohibited.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">8. Subscription and Payment</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Access to the Platform's complete features is subject to payment of a monthly subscription, the conditions of which are specified at the time of subscription.
                </p>
                <p>
                  No commission is charged on sales made.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">9. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  All content, logos, trademarks, interfaces, code, and data are the exclusive property of the Platform's operating company.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">10. Terms Modification</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms may be modified at any time. Users will be informed of any substantial changes.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">11. Applicable Law</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These terms are governed by French law. Any dispute shall fall under the exclusive jurisdiction of the courts of the company's registered office.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 