import Link from 'next/link';

interface Settings {
  general?: {
    siteName?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  footer?: {
    socialMedia?: Array<{ platform: string; url: string }>;
    copyright?: string;
  };
}

export default function LandingFooter({ settings }: { settings: Settings }) {
  const siteName = settings.general?.siteName || 'Desa Mata Mamplam';
  const currentYear = new Date().getFullYear();
  const copyright = settings.footer?.copyright || `© ${currentYear} ${siteName}. All rights reserved.`;

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-gray-400 mb-4">
              Website resmi pemerintahan desa untuk layanan dan informasi publik.
            </p>
            {settings.contactInfo && (
              <div className="space-y-2 text-gray-400">
                {settings.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{settings.contactInfo.phone}</span>
                  </div>
                )}
                {settings.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{settings.contactInfo.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/berita" className="text-gray-400 hover:text-white transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/layanan-surat" className="text-gray-400 hover:text-white transition-colors">
                  Layanan Surat
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="text-gray-400 hover:text-white transition-colors">
                  UMKM
                </Link>
              </li>
              <li>
                <Link href="/pembangunan" className="text-gray-400 hover:text-white transition-colors">
                  Pembangunan
                </Link>
              </li>
              <li>
                <Link href="/struktur-organisasi" className="text-gray-400 hover:text-white transition-colors">
                  Struktur Organisasi
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="text-gray-400 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
            <div className="flex gap-4">
              {settings.footer?.socialMedia && settings.footer.socialMedia.length > 0 ? (
                settings.footer.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="sr-only">{social.platform}</span>
                    {/* Generic icon */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    </svg>
                  </a>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Belum ada sosial media terdaftar</p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
