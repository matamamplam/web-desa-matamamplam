import Link from 'next/link';
import Image from 'next/image';

interface UMKM {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: {
    name: string;
  };
  logo: string | null;
  phone: string;
  address: string | null;
}

export default function UMKMShowcase({ umkm }: { umkm: UMKM[] }) {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">UMKM Desa</h2>
          <p className="text-gray-600">Dukung pelaku usaha ekonomi lokal kami</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {umkm.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
            >
              <div className="flex items-start gap-4 mb-4">
                {item.logo ? (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.logo}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                    {item.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                    {item.category.name}
                  </span>
                </div>
              </div>

              {item.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{item.phone}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/umkm"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            Lihat Semua UMKM
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
