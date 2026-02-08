import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/public/settings - Get settings for public consumption
export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        settings: {
          general: {
            siteName: 'Website Desa',
            tagline: '',
            description: '',
          },
          branding: {
            logo: '/images/logo.png',
            favicon: '/images/favicon.ico',
          },
          contact: {
            email: '',
            phone: '',
            whatsapp: '',
            address: '',
            mapUrl: '',
          },
          about: {
            title: '',
            content: '',
            vision: '',
            mission: [],
          },
          faq: [],
          footer: {
            description: '',
            socialMedia: {
              facebook: '',
              instagram: '',
              twitter: '',
              youtube: '',
            },
            copyright: '© 2024 Website Desa. All rights reserved.',
          },
          navigation: {
            externalLinks: [],
          },
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// Cache the response for 60 seconds
export const revalidate = 60;
