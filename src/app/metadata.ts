import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://watch-pros.com'),
  title: {
    default: 'Watch Pros - Luxury Watch Marketplace',
    template: '%s | Watch Pros'
  },
  description: 'Watch Pros is the leading marketplace for buying and selling luxury watches. Discover our selection of Rolex, Patek Philippe, Audemars Piguet watches and more.',
  keywords: ['luxury watches', 'rolex', 'patek philippe', 'audemars piguet', 'omega', 'vintage watches', 'buy watches', 'sell watches', 'watch marketplace'],
  authors: [{ name: 'Watch Pros' }],
  creator: 'Watch Pros',
  publisher: 'Watch Pros',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://watch-pros.com',
    siteName: 'Watch Pros',
    title: 'Watch Pros - Luxury Watch Marketplace',
    description: 'Watch Pros is the leading marketplace for buying and selling luxury watches. Discover our selection of Rolex, Patek Philippe, Audemars Piguet watches and more.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Watch Pros - Luxury Watch Marketplace'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Pros - Luxury Watch Marketplace',
    description: 'Watch Pros is the leading marketplace for buying and selling luxury watches.',
    images: ['/images/twitter-image.jpg'],
    creator: '@watchpros',
    site: '@watchpros'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  alternates: {
    canonical: 'https://watch-pros.com',
    languages: {
      'en-US': 'https://watch-pros.com/en',
      'fr-FR': 'https://watch-pros.com/fr',
    },
  },
  category: 'marketplace',
} 