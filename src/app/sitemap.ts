import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URLs
  const baseUrl = 'https://watch-pros.com'
  
  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/auth',
    '/register',
    '/listings',
    '/brands',
    '/models',
    '/sell',
    '/notifications',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes - Example for listings
  // In a real application, you would fetch these from your database
  const listings = [
    { id: '1', lastModified: new Date() },
    { id: '2', lastModified: new Date() },
    // Add more listings as needed
  ].map(listing => ({
    url: `${baseUrl}/listings/${listing.id}`,
    lastModified: listing.lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // Dynamic routes - Example for brands
  const brands = [
    { slug: 'rolex', lastModified: new Date() },
    { slug: 'patek-philippe', lastModified: new Date() },
    { slug: 'audemars-piguet', lastModified: new Date() },
    // Add more brands as needed
  ].map(brand => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...listings,
    ...brands,
  ]
} 