import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://matamamplam.my.id';

  // Static routes
  const routes = [
    '',
    '/tentang-kami',
    '/berita',
    '/umkm',
    '/pembangunan',
    '/struktur-organisasi',
    '/galeri',
    '/pengaduan',
    '/kontak',
    '/bencana',
    '/layanan-surat',
    '/cek-surat',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' || route === '/berita' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1 : route === '/berita' ? 0.9 : 0.8,
  }));

  // You can fetch dynamic routes here (e.g. from database)
  // const news = await prisma.news.findMany(...)

  return [...routes];
}
