import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/landing/HeroSection';
import QuickStats from '@/components/landing/QuickStats';
import LatestNews from '@/components/landing/LatestNews';
import OnlineServices from '@/components/landing/OnlineServices';
import UMKMShowcase from '@/components/landing/UMKMShowcase';
import DevelopmentProjects from '@/components/landing/DevelopmentProjects';
import StructurePreview from '@/components/landing/StructurePreview';
import VillageMap from '@/components/landing/VillageMap';
import DisasterAlert from '@/components/landing/DisasterAlert';
import FAQSection from '@/components/landing/FAQSection';

import { 
  getPublicStats, 
  getPublicNews, 
  getPublicUMKM, 
  getPublicProjects, 
  getPublicSettings, 
  getPublicStructure, 
  getPublicDisaster 
} from '@/lib/data-public';

async function getData() {
  try {
    const [stats, newsData, umkmData, projectsData, settingsData, structureData, disaster] = await Promise.all([
      getPublicStats(),
      getPublicNews(3),
      getPublicUMKM(6),
      getPublicProjects(3, 'IN_PROGRESS'),
      getPublicSettings(),
      getPublicStructure(),
      getPublicDisaster(),
    ]);

    // Extract settings with type safety
    const rawSettings = (settingsData as any)?.settings || settingsData || {};
    
    // Transform settings to expected format
    const settings = {
      general: rawSettings.general || {},
      branding: rawSettings.branding || {},
      contactInfo: {
        phone: rawSettings.contact?.phone || '',
        email: rawSettings.contact?.email || '',
        address: rawSettings.contact?.address || '',
        mapEmbedUrl: rawSettings.contact?.mapUrl || '',
      },
      footer: rawSettings.footer || {},
      faq: rawSettings.faq || [],
    } as any; // Cast to satisfy component prop types if needed

    // Transform News (handle null excerpt)
    const news = (newsData?.news || []).map((item: any) => ({
      ...item,
      excerpt: item.excerpt || '',
      thumbnail: item.thumbnail || null
    }));

    // Transform UMKM (map ownerPhone -> phone)
    const umkm = (umkmData?.umkm || []).map((item: any) => ({
      ...item,
      phone: item.ownerPhone || '',
      logo: item.logo || null,
      address: item.address || null
    }));

    // Transform Projects (add missing slug)
    const projects = (projectsData?.projects || []).map((item: any) => ({
      ...item,
      slug: item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      endDate: item.endDate || null,
      photoBefore: item.photoBefore || null,
      photoAfter: item.photoAfter || null
    }));

    return {
      stats,
      news,
      umkm,
      projects,
      settings,
      structure: structureData?.structure || { level1: [], level4: [] },
      disaster
    };
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return {
      stats: null,
      news: [],
      umkm: [],
      projects: [],
      settings: {
        general: {},
        branding: {},
        contactInfo: {
          phone: '',
          email: '',
          address: '',
          mapEmbedUrl: '',
        },
        footer: {},
        faq: [],
      },
      structure: { level1: [], level4: [] },
      disaster: null
    };
  }
}

export default async function LandingPage() {
  const { stats, news, umkm, projects, settings, structure, disaster } = await getData();

  return (
    <div className="min-h-screen">
      <DisasterAlert disaster={disaster} />
      <HeroSection settings={settings} />
      {stats && <QuickStats stats={stats} />}
      {news.length > 0 && <LatestNews news={news} />}
      <OnlineServices />
      {umkm.length > 0 && <UMKMShowcase umkm={umkm} />}
      {projects.length > 0 && <DevelopmentProjects projects={projects} />}
      <StructurePreview structure={structure} />
      {settings.faq && settings.faq.length > 0 && <FAQSection faq={settings.faq} />}
      <VillageMap settings={settings} />
    </div>
  );
}
