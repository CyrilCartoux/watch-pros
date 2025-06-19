import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  metadataBase: new URL('https://watch-pros.com'),
  title: {
    default: 'Watch Pros - B2B Marketplace for Professional Watch Dealers',
    template: '%s | Watch Pros B2B'
  },
  description: 'Watch Pros is the leading B2B marketplace for professional watch dealers. Buy and sell luxury watches with trusted pros worldwide.',
  keywords: [
    'B2B', 'professional watch dealers', 'luxury watches', 'wholesale watches', 'rolex', 'patek philippe', 'audemars piguet', 'omega', 'vintage watches', 'buy watches', 'sell watches', 'watch marketplace', 'trade watches', 'dealer platform', 'watch pros only', 'business to business', 'pro sellers', 'watch trade', 'watch wholesale'
  ],
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
    title: 'Watch Pros - B2B Marketplace for Professional Watch Dealers',
    description: 'The leading B2B marketplace for professional watch dealers. Buy and sell luxury watches with trusted pros worldwide.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Watch Pros - B2B Marketplace for Professional Watch Dealers'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch Pros - B2B Marketplace for Professional Watch Dealers',
    description: 'The leading B2B marketplace for professional watch dealers. Buy and sell luxury watches with trusted pros worldwide.',
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