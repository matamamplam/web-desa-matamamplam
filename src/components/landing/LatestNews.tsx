import Link from 'next/link';
import NewsCard from './NewsCard';

interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  category: {
    name: string;
  };
  createdAt: string;
  author: {
    name: string;
  };
}

export default function LatestNews({ news }: { news: News[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Berita Terbaru</h2>
          <p className="text-gray-600">Informasi dan pengumuman terkini dari desa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              id={item.id}
              title={item.title}
              slug={item.slug}
              excerpt={item.excerpt}
              thumbnail={item.thumbnail}
              category={item.category.name}
              createdAt={item.createdAt}
              author={item.author}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/berita"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Lihat Semua Berita
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
