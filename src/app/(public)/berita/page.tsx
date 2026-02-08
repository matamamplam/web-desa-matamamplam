import { prisma } from '@/lib/prisma';
import NewsCard from '@/components/landing/NewsCard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getNews() {
  try {
    const news = await prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
      },
      take: 12,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        category: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

export default async function BeritaPage() {
  const news = await getNews();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Berita Desa
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Informasi terkini seputar kegiatan dan pengumuman desa
          </p>
        </div>
      </div>

      {/* News Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {news.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-white rounded-full shadow-lg mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada Berita
            </h3>
            <p className="text-gray-600">
              Berita akan ditampilkan di sini setelah dipublikasikan
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Semua Berita
              </h2>
              <p className="text-gray-600">
                Menampilkan {news.length} berita terbaru
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  slug={item.slug}
                  excerpt={item.excerpt || ''}
                  thumbnail={item.thumbnail}
                  category={item.category.name}
                  createdAt={item.createdAt.toISOString()}
                  author={item.author}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
