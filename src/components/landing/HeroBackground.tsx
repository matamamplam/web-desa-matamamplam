"use client";

import Image from 'next/image';

interface HeroBackgroundProps {
  heroBackground?: string;
}

export default function HeroBackground({ heroBackground }: HeroBackgroundProps) {
  return (
    <>
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
              unoptimized={heroBackground.includes('cloudinary') ? false : true}
              onError={(e) => {
                console.error('Failed to load hero background:', heroBackground);
                // Hide image on error
                (e.target as HTMLElement).style.display = 'none';
              }}
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
    </>
  );
}
