'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaLink, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link disalin');
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  if (!url) {
    return (
      <div className="flex gap-3 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-10 bg-gray-200 rounded-full" />
        ))}
      </div>
    );
  }

  const buttons = [
    {
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      color: "bg-green-500 hover:bg-green-600 text-white",
      label: "WhatsApp"
    },
    {
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      label: "Facebook"
    },
    {
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: "bg-black hover:bg-gray-800 text-white",
      label: "Twitter / X"
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {buttons.map((btn, idx) => (
        <a
          key={idx}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 shadow-sm ${btn.color}`}
          title={`Bagikan ke ${btn.label}`}
        >
          <btn.icon className="text-lg" />
        </a>
      ))}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-transform hover:scale-110 shadow-sm"
        title="Salin Link"
      >
        <FaLink className="text-sm" />
      </button>
    </div>
  );
}
