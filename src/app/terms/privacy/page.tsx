import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy - Watch Pros®",
  description: "Privacy Policy and Data Protection for Watch Pros® platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12 md:py-16">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Beta Early Access - June 2025
            </p>
            <Separator className="my-8" />
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">1. Data Controller</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The platform is operated by [Company Name], in the process of incorporation, responsible for processing data collected on the platform.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">2. Collected Data</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  As part of registration and use of the platform, we only collect data necessary for providing our B2B services:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Professional identification data (name, company, registration number, SIRET, etc.)</li>
                  <li>Professional contact details (email, phone)</li>
                  <li>Connection information (IP address, connection logs)</li>
                  <li>Platform activity data (listing views, searches, interactions)</li>
                  <li>KYC verification documents (Kbis extract, professional certificates)</li>
                  <li>Billing and payment information (managed via our secure payment provider)</li>
                </ul>
                <p>
                  We do not collect sensitive data or personal data unnecessary for professional use of the platform.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">3. Purpose of Processing</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The collected data is used only for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Management of professional user accounts</li>
                  <li>Profile moderation and verification</li>
                  <li>Proper functioning of offered services</li>
                  <li>Subscription and payment processing</li>
                  <li>Customer relationship and support management</li>
                  <li>Compliance with our legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">4. Data Recipients</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Data is processed only by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The internal team of [Company Name]</li>
                  <li>Our technical providers under contract (hosting, KYC, secure payment, CRM, support)</li>
                </ul>
                <p>
                  No data transfer or sale to third parties without your explicit consent.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">5. Data Security</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We implement technical and organizational security measures in line with market standards to protect data against any unauthorized access, loss, or disclosure.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">6. Data Retention</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Data is retained for the duration of the contractual relationship and in compliance with legal retention obligations.
                </p>
                <p>
                  In case of account closure, data is deleted or anonymized within a reasonable timeframe.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">7. User Rights (GDPR)</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Under GDPR, you have the following rights regarding your data:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right of access</li>
                  <li>Right to rectification</li>
                  <li>Right to erasure (within legal limits)</li>
                  <li>Right to data portability</li>
                  <li>Right to object or restrict processing</li>
                </ul>
                <p>
                  To exercise your rights, you can contact us at: [admin@watch-pros.com]
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">8. Cookies and Trackers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The platform uses only technical cookies necessary for the functioning and security of the application.
                </p>
                <p>
                  No advertising or third-party tracking cookies are used in this beta phase.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">9. Policy Evolution</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This policy may be updated at any time according to service evolution and applicable regulations.
                </p>
                <p>
                  Any substantial modification will be notified to users.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-primary">10. Contact</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  For any questions regarding data protection:
                </p>
                <p>
                  [Company Name]<br />
                  [Address]<br />
                  [email]
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 