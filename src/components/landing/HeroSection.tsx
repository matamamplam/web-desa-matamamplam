import Link from 'next/link';
import Image from 'next/image';

interface Settings {
  general?: {
    siteName?: string;
    tagline?: string;
    description?: string;
    heroBackground?: string;
  };
  branding?: {
    logo?: string;
  };
}

export default function HeroSection({ settings }: { settings: Settings }) {
  const siteName = settings.general?.siteName || 'Desa Mata Mamplam';
  const tagline = settings.general?.tagline || 'Kecamatan Peusangan, Kabupaten Bireuen';
  const description = settings.general?.description || 'Website resmi pemerintahan desa';
  const heroBackground = settings.general?.heroBackground;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image or Gradient */}
      {heroBackground ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={heroBackground}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-purple-900/80"></div>
        </>
      ) : (
        /* Fallback gradient background */
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
      )}

      {/* Animated Background Blobs (only show if no background image) */}
      {!heroBackground && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-32">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg animate-fade-in-up">
          {siteName}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 mb-4 animate-fade-in-up animation-delay-200">
          {tagline}
        </p>
        <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600 mb-12">
          <Link
            href="/layanan-surat"
            className="px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
          >
            📝 Layanan Surat Online
          </Link>
          <Link
            href="#layanan"
            className="px-8 py-4 bg-blue-500/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-blue-500/50 transition-all border-2 border-white/30"
          >
            Jelajahi Layanan
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
