import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Terms of Sale - Watch Pros®",
  description: "Terms of Sale and Subscription Conditions for Watch Pros® platform",
}

export default function TermsOfSalePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Terms of Sale</h1>
            <p className="text-lg text-muted-foreground">
              Beta Early Access - June 2025
            </p>
            <Separator className="my-8" />
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">1. Purpose</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Sale (TOS) govern the subscription and use of paid services of the [Platform Name] platform operated by [Your Company Name], in the process of incorporation.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">2. Service Offer</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>The platform offers a subscription allowing watch professionals to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Publish watch and related product listings</li>
                  <li>Access search, alert, and listing management features</li>
                  <li>Benefit from visibility among other validated professional dealers</li>
                </ul>
                <p>
                  Services are reserved for professionals validated by the platform, for B2B use only.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">3. Subscription Plans</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Subscriptions are offered as monthly plans with no minimum duration commitment.
                </p>
                <p>
                  The rates for different plans are specified on the website at the time of subscription and may be revised at any time for new subscribers.
                </p>
                <p>
                  Early Bird subscribers benefit from a lifetime guaranteed preferential rate, subject to maintaining their active subscription without interruption.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">4. Subscription and Payment</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The subscription is made online through the platform.
                </p>
                <p>
                  Payment is made exclusively by credit card through our secure payment provider (Stripe).
                </p>
                <p>
                  Payments are made by automatic monthly debit on the subscription anniversary date.
                </p>
                <p>
                  In case of payment failure, a reminder will be sent. Without regularization within 7 days, account access may be suspended.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">5. Duration and Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The subscription is concluded for a monthly duration, tacitly renewable.
                </p>
                <p>
                  Each subscriber can terminate their subscription at any time from their personal space.
                </p>
                <p>
                  Termination takes effect at the end of the current monthly period. No pro-rata refund will be made.
                </p>
                <p>
                  In case of breach of the Terms of Use, particularly in case of false professional declaration, the platform reserves the right to suspend or close the account without refund.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">6. Price Modifications</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Any price modification will only apply to new subscriptions or renewals outside the Early Bird period.
                </p>
                <p>
                  Early Bird subscribers retain their initial rate as long as their subscription remains active.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">7. Responsibilities</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The platform provides a listing hosting and connection service.
                </p>
                <p>
                  It cannot be held responsible for transactions concluded between users.
                </p>
                <p>
                  User obligations and responsibilities are specified in the Terms of Use (TOU).
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">8. Personal Data</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The processing of personal data related to the subscription is carried out in accordance with the Privacy Policy accessible on the website.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">9. Applicable Law - Competent Jurisdiction</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Sale are governed by French law.
                </p>
                <p>
                  In case of dispute, exclusive jurisdiction is given to the courts of the company's registered office.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 