import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { cache } from 'react';


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
      // No changes needed here if force-dynamic is used in pages.
// But I should check the home page.,
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

export const getPublicSettings = cache(async () => {
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
    api: {
        publicToken: '', // Ensure structure completeness
    }
  };

  // Retry logic for settings (Critical data)
  let retries = 3;
  while (retries > 0) {
    try {
      const settingsRecord = await prisma.siteSettings.findFirst();

      if (!settingsRecord) {
        return defaultSettings;
      }

      // IMPORTANT: Return the JSON settings content directly
      const settings = settingsRecord.settings as any;
      
      return settings;
    } catch (error) {
      console.error(`❌ Error fetching public settings (Attempt ${4 - retries}/3):`, error);
      retries--;
      if (retries === 0) {
        // Return defaults instead of null to prevent undefined errors
        return defaultSettings;
      }
      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return defaultSettings;
});

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
    return { structure: { level1: [], level4: [], all: [] } };
  }
}

export async function getOrgChartData() {
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
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // Transform into hierarchy
    // Strict checks for Level 1
    const keuchik = positions.find(p => p.positionKey === 'KEUCHIK');
    const legislative = positions.filter(p => p.category === 'ADVISORY' || p.positionKey.includes('TUHA'));
    const imum = positions.find(p => p.positionKey === 'IMUM_GAMPONG' || p.category === 'RELIGIOUS');
    
    // Executive logic
    const sekdes = positions.find(p => p.positionKey === 'SEKDES');
    
    // Level 3 Subordinates (Kaur + Kasi)
    // In our new seed, Kasi and Kaur are both Level 3.
    // We want them all in one list, sorted by sortOrder (which we defined in seed).
    const subordinates = positions.filter(p => p.level === 3);
    
    const dusun = positions.filter(p => p.category === 'DUSUN');

    return {
        keuchik,
        legislative,
        imum,
        executive: {
            sekdes,
            // Combined subordinates for the horizontal row below Sekdes
            subordinates: subordinates.sort((a, b) => a.sortOrder - b.sortOrder)
        },
        dusun
    };

  } catch (error) {
    console.error('Error fetching structure:', error);
    return { 
        keuchik: null, 
        legislative: [], 
        imum: null,
        executive: { sekdes: null, subordinates: [] }, 
        dusun: [] 
    };
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
