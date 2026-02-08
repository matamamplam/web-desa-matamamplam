import { prisma } from '@/lib/prisma';
import UMKMCard from '@/components/landing/UMKMCard';
import Link from 'next/link';

export const revalidate = 600; // Cache for 10 minutes

async function getUMKM(categorySlug?: string) {
  try {
    const whereClause: any = {
      isActive: true,
    };

    if (categorySlug) {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    const umkm = await prisma.uMKM.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        logo: true,
        ownerPhone: true,
        address: true,
      },
    });

    return umkm;
  } catch (error) {
    console.error('Error fetching UMKM:', error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.uMKMCategory.findMany({
      select: { name: true, slug: true },
    });
  } catch (error) {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function UMKMPage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const [umkm, categories] = await Promise.all([
    getUMKM(category),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        {/* ... */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ... */}

        {/* UMKM Grid */}
        {umkm.length === 0 ? (
          <div className="text-center py-20">
            {/* ... */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Belum Ada UMKM
            </h3>
            <p className="text-gray-600">
              Data UMKM akan muncul di sini setelah didaftarkan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {umkm.map((item) => (
              <UMKMCard
                key={item.id}
                id={item.id}
                name={item.name}
                slug={item.slug}
                description={item.description}
                category={item.category.name}
                logo={item.logo}
                phone={item.ownerPhone}
                address={item.address}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
