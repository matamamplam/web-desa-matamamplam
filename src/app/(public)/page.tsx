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

async function getData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const [statsRes, newsRes, umkmRes, projectsRes, settingsRes, structureRes, disasterRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/stats`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/public/news?limit=3`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/public/umkm?limit=6`, { next: { revalidate: 600 } }),
      fetch(`${baseUrl}/api/public/projects?limit=3&status=ONGOING`, { next: { revalidate: 600 } }),
      fetch(`${baseUrl}/api/public/settings`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/public/structure`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/public/disaster`, { next: { revalidate: 0 } }), // Always fresh for disaster
    ]);

    const stats = statsRes.ok ? await statsRes.json() : null;
    const newsData = newsRes.ok ? await newsRes.json() : { news: [] };
    const umkmData = umkmRes.ok ? await umkmRes.json() : { umkm: [] };
    const projectsData = projectsRes.ok ? await projectsRes.json() : { projects: [] };
    const settingsData = settingsRes.ok ? await settingsRes.json() : { settings: {} };
    const structureData = structureRes.ok ? await structureRes.json() : { structure: { level1: [], level4: [] } };
    const disasterData = disasterRes.ok ? await disasterRes.json() : null;

    // Extract settings
    const rawSettings = settingsData.settings || settingsData;
    
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
      news: newsData.news || [],
      umkm: umkmData.umkm || [],
      projects: projectsData.projects || [],
      settings,
      structure: structureData.structure || { level1: [], level4: [] },
      disaster: disasterData
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
