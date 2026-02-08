import Link from 'next/link';
import Image from 'next/image';

interface UMKMCardProps {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  logo: string | null;
  phone: string;
  address: string | null;
}

export default function UMKMCard({
  id,
  name,
  slug,
  description,
  category,
  logo,
  phone,
  address,
}: UMKMCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Header / Logo Area */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        {logo ? (
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-sm border-4 border-white">
            <Image
              src={logo}
              alt={name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-inner border-4 border-white">
            <span className="text-4xl font-bold text-white">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur text-purple-700 text-xs font-semibold rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center line-clamp-1">
          {name}
        </h3>
        
        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 text-center flex-1">
            {description}
          </p>
        )}

        <div className="space-y-3 mt-auto">
          {address && (
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="line-clamp-1">{address}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            <Link 
              href={`/umkm/${slug}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Lihat Detail
            </Link>
            
            <a
              href={`https://wa.me/${phone.replace(/^0/, '62').replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(name)},%20saya%20tertarik%20dengan%20produk%20Anda.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
