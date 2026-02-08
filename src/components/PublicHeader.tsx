import Link from 'next/link';
import Image from 'next/image';

interface PublicHeaderProps {
  siteName?: string;
  tagline?: string;
  logo?: string;
}

export default function PublicHeader({ siteName = 'Desa Mata Mamplam', tagline = 'Kecamatan Peusangan, Kabupaten Bireuen', logo }: PublicHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and Site Info */}
          <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
            {logo && (
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full p-2 shadow-md">
                <Image
                  src={logo}
                  alt={siteName}
                  fill
                  className="object-contain p-1"
                />
              </div>
            )}
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">{siteName}</h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">{tagline}</p>
            </div>
          </Link>

          {/* Optional: Language/Search Icons */}
          <div className="flex items-center gap-2">
            {/* Can add search or language switcher here */}
          </div>
        </div>
      </div>
    </header>
  );
}
