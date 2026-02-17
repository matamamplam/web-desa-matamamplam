'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

interface NavbarProps {
  siteName?: string;
  logo?: string;
}

interface NavCommandItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  type: 'link' | 'dropdown';
  href?: string;
  items?: NavCommandItem[];
}

export default function PublicNavbar({ siteName = 'Desa Mata Mamplam', logo }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navStructure: NavGroup[] = [
    { label: 'Beranda', type: 'link', href: '/' },
    {
      label: 'Profil',
      type: 'dropdown',
      items: [
        { label: 'Tentang Kami', href: '/tentang-kami' },
        { label: 'Struktur Organisasi', href: '/struktur-organisasi' },
        { label: 'Galeri', href: '/galeri' },
      ],
    },
    {
      label: 'Informasi',
      type: 'dropdown',
      items: [
        { label: 'Berita', href: '/berita' },
        { label: 'UMKM', href: '/umkm' },
        { label: 'Pembangunan', href: '/pembangunan' },
        { label: 'Info Bencana', href: '/bencana' },
      ],
    },
    {
      label: 'Layanan',
      type: 'dropdown',
      items: [
        { label: 'Layanan Surat', href: '/layanan-surat' },
        { label: 'Cek Surat', href: '/cek-surat' },
        { label: 'Pengaduan', href: '/pengaduan' },
      ],
    },
    { label: 'Kontak', type: 'link', href: '/kontak' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const toggleDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  const isGroupActive = (group: NavGroup) => {
    if (group.type === 'link') return pathname === group.href;
    return group.items?.some(item => pathname === item.href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm font-sans transition-all duration-300" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Site Name */}
          <Link href="/" className="flex items-center gap-3 group">
            {logo ? (
              <img
                src={logo}
                alt={siteName}
                className="h-9 w-auto max-w-[150px] object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
                <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-lg group-hover:shadow-blue-300 transition-all">
                    {siteName.charAt(0)}
                </div>
            )}
            <div className="hidden sm:flex flex-col">
                 <span className="font-bold text-base text-gray-900 leading-tight group-hover:text-blue-700 transition-colors">
                  {siteName}
                </span>
            </div>
           
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navStructure.map((group) => (
              <div key={group.label} className="relative group">
                {group.type === 'link' ? (
                  <Link
                    href={group.href!}
                    className={`nav-link text-sm font-medium transition-colors p-2 rounded-lg flex items-center gap-1 ${
                       pathname === group.href ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {group.label}
                  </Link>
                ) : (
                  <div>
                    <button
                      onClick={() => toggleDropdown(group.label)}
                      className={`nav-link text-sm font-medium transition-colors p-2 rounded-lg flex items-center gap-1 ${
                        isGroupActive(group) ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      {group.label}
                      <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Desktop Dropdown Panel */}
                    <div 
                        className={`absolute left-0 mt-3 w-60 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-100 transition-all duration-300 origin-top-left z-50 transform ${
                            activeDropdown === group.label 
                            ? 'opacity-100 scale-100 translate-y-0 visible' 
                            : 'opacity-0 scale-95 -translate-y-2 invisible'
                        }`}
                    >
                      <div className="p-2 space-y-1">
                        {group.items?.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                              pathname === item.href
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:translate-x-1'
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* CTA Button */}
            <Link
                href="/layanan-surat"
                className="ml-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md shadow-blue-200 transform hover:-translate-y-0.5"
            >
              Buat Surat
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Panel */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-lg text-gray-800">Menu</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <FiX className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {navStructure.map((group) => (
                  <div key={group.label} className="border-b border-gray-100 last:border-0 pb-1 mb-1">
                    {group.type === 'link' ? (
                      <Link
                        href={group.href!}
                        className={`flex items-center w-full px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                          pathname === group.href
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {group.label}
                      </Link>
                    ) : (
                      <div className="rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleDropdown(group.label)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                              isGroupActive(group) ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {group.label}
                          <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${activeDropdown === group.label ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <div 
                            className={`bg-gray-50 space-y-1 overflow-hidden transition-all duration-300 ${
                                activeDropdown === group.label ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
                            }`}
                        >
                          {group.items?.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block px-8 py-2.5 text-sm font-medium rounded-r-lg border-l-2 ml-4 hover:bg-gray-100 transition-colors ${
                                pathname === item.href
                                  ? 'border-blue-500 text-blue-600 bg-white'
                                  : 'border-transparent text-gray-600'
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            
            <div className="p-4 border-t bg-gray-50">
               <Link
                href="/layanan-surat"
                className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
               >
                 Buat Surat Sekarang
               </Link>
            </div>
        </div>
      </div>
    </nav>
  );
}
