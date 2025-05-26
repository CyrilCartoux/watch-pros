import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata, Viewport } from "next/types";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Watch Pros - B2B Luxury Watch Marketplace",
  description: "The premier B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide.",
  keywords: [
    "luxury watches",
    "B2B marketplace",
    "watch dealers",
    "watch collectors",
    "luxury timepieces",
    "watch trading",
    "watch authentication",
    "watch verification",
  ],
  authors: [{ name: "Watch Pros" }],
  creator: "Watch Pros",
  metadataBase: new URL("https://watchpros.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://watchpros.com",
    title: "Watch Pros - B2B Luxury Watch Marketplace",
    description: "The premier B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide.",
    siteName: "Watch Pros",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watch Pros - B2B Luxury Watch Marketplace",
    description: "The premier B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide.",
    creator: "@watchpros",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
