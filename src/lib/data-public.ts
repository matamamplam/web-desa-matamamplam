import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';


export async function getPublicStats() {
  try {
    const [totalPenduduk, maleCount, femaleCount, totalKK, totalUMKM, totalProjects, ongoingProjects] = await Promise.all([
      prisma.penduduk.count(),
      prisma.penduduk.count({ where: { jenisKelamin: 'LAKI_LAKI' } }),
      prisma.penduduk.count({ where: { jenisKelamin: 'PEREMPUAN' } }),
      prisma.kartuKeluarga.count(),
      prisma.uMKM.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    return {
      population: {
        total: totalPenduduk,
        male: maleCount,
        female: femaleCount,
        kk: totalKK,
      },
      umkm: {
        total: totalUMKM,
        active: totalUMKM,
      },
      projects: {
        total: totalProjects,
        ongoing: ongoingProjects,
        completed: totalProjects - ongoingProjects,
      },
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export async function getPublicNews(limit: number = 10, category?: string) {
  try {
    const whereClause: Prisma.NewsWhereInput = {
      status: 'PUBLISHED',
    };

    if (category) {
      whereClause.category = {
        name: category
      };
    }

    const news = await prisma.news.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        category: { select: { name: true } },
        createdAt: true,
        author: { select: { name: true } },
      },
    });

    return { news };
  } catch (error) {
    console.error('Error fetching public news:', error);
    return { news: [] };
  }
}

export async function getPublicUMKM(limit: number = 12, category?: string) {
  try {
    const whereClause: Prisma.UMKMWhereInput = {
      isActive: true,
    };

    if (category) {
      whereClause.category = {
        name: category
      };
    }

    const umkm = await prisma.uMKM.findMany({
      where: whereClause,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: { select: { name: true } },
        logo: true,
        ownerPhone: true,
        address: true,
      },
    });

    return { umkm };
  } catch (error) {
    console.error('Error fetching public UMKM:', error);
    return { umkm: [] };
  }
}

export async function getPublicProjects(limit: number = 6, status?: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD') {
  try {
    const whereClause: Prisma.ProjectWhereInput = {};

    if (status) {
      whereClause.status = status;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      take: limit,
      orderBy: { startDate: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        budget: true,
        location: true,
        progress: true,
        startDate: true,
        endDate: true,
        photoBefore: true,
        photoAfter: true,
        photoGallery: true,
      },
    });

    return { projects };
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return { projects: [] };
  }
}

export async function getPublicSettings() {
  // Comprehensive fallback settings for build/runtime failures
  const defaultSettings = {
    general: { 
      siteName: 'Desa Mata Mamplam', 
      tagline: 'Kecamatan Peusangan, Kabupaten Bireuen',
      description: 'Website resmi pemerintahan desa',
      heroBackground: '' // Empty string instead of null
    },
    branding: { 
      logo: '/images/logo.png', 
      favicon: '/images/favicon.ico' 
    },
    contact: { 
      email: '', 
      phone: '', 
      whatsapp: '', 
      address: '', 
      mapUrl: '' // Empty string instead of null
    },
    about: { 
      title: '', 
      content: '', 
      vision: '', 
      mission: [] 
    },
    faq: [],
    footer: {
      description: '',
      socialMedia: { facebook: '', instagram: '', twitter: '', youtube: '' },
      copyright: `© ${new Date().getFullYear()} Desa Mata Mamplam. All rights reserved.`,
    },
    navigation: { externalLinks: [] },
  };

  try {
    const settingsRecord = await prisma.siteSettings.findFirst();

    if (!settingsRecord) {
      console.warn('⚠️ No settings record found in database, using defaults');
      return defaultSettings;
    }

    // IMPORTANT: Return the JSON settings content directly
    // This ensures consistent structure across all consumers
    const settings = settingsRecord.settings as any;
    
    console.log('📤 getPublicSettings returning:', {
      hasGeneral: !!settings?.general,
      hasBranding: !!settings?.branding,
      hasHeroBackground: !!settings?.general?.heroBackground,
      hasLogo: !!settings?.branding?.logo,
      hasFavicon: !!settings?.branding?.favicon,
      hasMapUrl: !!settings?.contact?.mapUrl,
    });
    
    return settings;
  } catch (error) {
    console.error('❌ Error fetching public settings:', error);
    // Return defaults instead of null to prevent undefined errors
    return defaultSettings;
  }
}

export async function getPublicStructure() {
  try {
    const positions = await prisma.villageOfficialPosition.findMany({
      include: {
        official: {
          select: {
            id: true,
            name: true,
            photo: true,
            email: true,
            address: true,
            startDate: true,
            endDate: true,
            isActive: true,
            // phone is NOT included
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return {
        structure: {
        level1: positions.filter((p) => p.level === 1),
        level2: positions.filter((p) => p.level === 2),
        level3: positions.filter((p) => p.level === 3),
        level4: positions.filter((p) => p.level === 4),
        level5: positions.filter((p) => p.level === 5),
        level6: positions.filter((p) => p.level === 6),
        all: positions,
      }
    };
  } catch (error) {
    console.error('Error fetching public structure:', error);
    return { structure: { level1: [], level4: [] } };
  }
}

export async function getPublicDisaster() {
  try {
    const activeEvent = await prisma.disasterEvent.findFirst({
      where: { status: "ACTIVE" },
      include: {
        posts: {
          where: { isActive: true },
          include: {
            _count: { select: { refugees: true } },
            logistics: true
          }
        },
        damage: { orderBy: { reportedAt: 'desc' } },
        _count: { select: { affected: true, damage: true } }
      },
      orderBy: { startDate: "desc" }
    });

    if (!activeEvent) {
      return null;
    }

    const stats = await prisma.affectedResident.groupBy({
      by: ['condition'],
      where: { eventId: activeEvent.id },
      _count: { _all: true }
    });

    return { event: activeEvent, stats };
  } catch (error) {
    console.error("API Error (Public Disaster):", error);
    return null;
  }
}
