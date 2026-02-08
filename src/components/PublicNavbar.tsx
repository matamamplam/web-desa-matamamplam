'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  siteName?: string;
  logo?: string;
}

export default function PublicNavbar({ siteName = 'Desa Mata Mamplam', logo }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Beranda', href: '/' },
    { label: 'Tentang', href: '/tentang-kami' },
    { label: 'Berita', href: '/berita' },
    { label: 'UMKM', href: '/umkm' },
    { label: 'Pembangunan', href: '/pembangunan' },
    { label: 'Struktur Organisasi', href: '/struktur-organisasi' },
    { label: 'Galeri', href: '/galeri' },
    { label: 'Pengaduan', href: '/pengaduan' },
    { label: 'Kontak', href: '/kontak' },
    { label: 'Info Bencana', href: '/bencana' },
    { label: 'Cek Surat', href: '/cek-surat' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Site Name */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {logo && (
              <img
                src={logo}
                alt={siteName}
                className="h-10 w-10 object-contain"
              />
            )}
            <span className="font-bold text-xl text-gray-900 hidden sm:block">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/layanan-surat"
              className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Layanan Surat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/layanan-surat"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Layanan Surat
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
