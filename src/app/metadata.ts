import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Watch Pros | Luxury Watch Marketplace',
  description: 'Discover and trade luxury timepieces in our premium B2B marketplace. Connect with verified dealers and collectors worldwide.',
  openGraph: {
    title: 'Watch Pros | Luxury Watch Marketplace',
    description: 'Discover and trade luxury timepieces in our premium B2B marketplace. Connect with verified dealers and collectors worldwide.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Watch Pros Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Pros | Luxury Watch Marketplace',
    description: 'Discover and trade luxury timepieces in our premium B2B marketplace.',
    images: ['/og-image.jpg'],
  },
} 