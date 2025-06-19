import { MetadataRoute } from 'next'
// TODO: importer le client DB ou utiliser fetch pour récupérer les vraies données

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

  // TODO: Remplacer par un fetch/DB call
  const listings = [
    // Exemple : await fetch(`${baseUrl}/api/listings`).then(res => res.json())
    { id: '1', lastModified: new Date() },
    { id: '2', lastModified: new Date() },
  ].map(listing => ({
    url: `${baseUrl}/listings/${listing.id}`,
    lastModified: listing.lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  // TODO: Remplacer par un fetch/DB call
  const brands = [
    { slug: 'rolex', lastModified: new Date() },
    { slug: 'patek-philippe', lastModified: new Date() },
    { slug: 'audemars-piguet', lastModified: new Date() },
  ].map(brand => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: brand.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // TODO: Ajouter les sellers dynamiquement
  // const sellers = ...

  return [
    ...staticRoutes,
    ...listings,
    ...brands,
    // ...sellers
  ]
} 