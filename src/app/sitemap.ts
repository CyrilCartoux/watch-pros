import { MetadataRoute } from 'next'
import { models } from '@/data/models'
import { brands } from '@/data/brands'

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

  const brandsSitemap = brands.map(brand => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
    models: models[brand.slug].map(model => ({
        url: `${baseUrl}/listings/${model.model_slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      }))
  }))


  return [
    ...staticRoutes,
    ...brandsSitemap,
  ]
} 