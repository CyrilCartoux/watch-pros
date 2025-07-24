import { Inter } from "next/font/google"
import "./globals.css"
import { Metadata, Viewport } from "next/types"
import dynamic from "next/dynamic"
import ClientLayout from "./client-layout"
import { defaultMetadata } from "./metadata"
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = defaultMetadata

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="apple-touch-icon" href="/icons/maskable_icon_x192.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegister />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
