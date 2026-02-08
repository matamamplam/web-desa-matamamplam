import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://desa-mata-mamplam.vercel.app';

  // Static routes
  const routes = [
    '',
    '/tentang-kami',
    '/berita',
    '/umkm',
    '/kontak',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // You can fetch dynamic routes here (e.g. from database)
  // const news = await prisma.news.findMany(...)

  return [...routes];
}
