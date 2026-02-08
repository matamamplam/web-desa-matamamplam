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

    // Extract settings
    const rawSettings = settingsData?.settings || settingsData || {};
    
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
    };

    return {
      stats,
      news: newsData?.news || [],
      umkm: umkmData?.umkm || [],
      projects: projectsData?.projects || [],
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
