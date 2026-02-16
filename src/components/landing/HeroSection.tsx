import Link from 'next/link';
import HeroBackground from './HeroBackground';

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
      <HeroBackground heroBackground={heroBackground} />

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
