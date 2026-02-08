import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NewsCard from '@/components/landing/NewsCard';
import ShareButtons from '@/components/ShareButtons';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getNews(slug: string) {
  try {
    const news = await prisma.news.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        thumbnail: true,
        category: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        viewCount: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!news) {
      return null;
    }

    // Increment view count
    await prisma.news.update({
      where: { id: news.id },
      data: { viewCount: { increment: 1 } },
    });

    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

async function getRelatedNews(currentId: string, category: string) {
  try {
    const related = await prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        category: {
          name: category,
        },
        id: { not: currentId },
      },
      take: 3,
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

    return related;
  } catch (error) {
    console.error('Error fetching related news:', error);
    return [];
  }
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  const relatedNews = await getRelatedNews(news.id, news.category.name);

  const formatDate = (dateString: Date) => {
    return dateString.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const categoryColors: Record<string, string> = {
    PENGUMUMAN: 'bg-blue-100 text-blue-800',
    KEGIATAN: 'bg-green-100 text-green-800',
    BERITA: 'bg-purple-100 text-purple-800',
    LAINNYA: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Beranda</Link>
            <span>/</span>
            <Link href="/berita" className="hover:text-blue-600">Berita</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          <div className="mb-4">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${categoryColors[news.category.name] || categoryColors.LAINNYA}`}>
              {news.category.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {news.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">{news.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(news.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{news.viewCount} views</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {news.thumbnail && (
          <div className="relative w-full h-96 mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={news.thumbnail}
              alt={news.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Share Buttons */}
        <div className="border-t border-b border-gray-200 py-6 mb-12">
          <p className="text-sm font-semibold text-gray-700 mb-3">Bagikan:</p>
          <div className="flex gap-3">
            <ShareButtons title={news.title} />
          </div>
        </div>
      </article>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Berita Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
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
          </div>
        </div>
      )}
    </div>
  );
}
