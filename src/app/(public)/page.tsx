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
import InfoBar from '@/components/landing/InfoBar';

import { 
  getPublicStats, 
  getPublicNews, 
  getPublicUMKM, 
  getPublicProjects, 
  getPublicSettings, 
  getPublicStructure, 
  getPublicDisaster 
} from '@/lib/data-public';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Helper function to get weather description from code
function getWeatherDesc(code: number) {
  if (code === 0) return { label: "Cerah", icon: "☀️" }
  if (code >= 1 && code <= 3) return { label: "Berawan", icon: "⛅" }
  if (code >= 45 && code <= 48) return { label: "Kabut", icon: "🌫️" }
  if (code >= 51 && code <= 55) return { label: "Gerimis", icon: "🌦️" }
  if (code >= 61 && code <= 65) return { label: "Hujan", icon: "🌧️" }
  if (code >= 80 && code <= 82) return { label: "Hujan Lebat", icon: "⛈️" }
  if (code >= 95) return { label: "Badai Petir", icon: "⚡" }
  return { label: "Cerah", icon: "☀️" }
}

async function getData() {
  try {
    const [stats, newsData, umkmData, projectsData, settingsData, structureData, disasterData] = await Promise.all([
      getPublicStats(),
      getPublicNews(),
      getPublicUMKM(),
      getPublicProjects(),
      getPublicSettings(),
      getPublicStructure(),
      getPublicDisaster(),
    ]);


    // Extract settings with type safety
    const rawSettings = (settingsData as any)?.settings || settingsData || {};
    
    // Debug logging
    console.log('🔍 Raw Settings:', JSON.stringify(rawSettings, null, 2));
    console.log('🗺️ Map URL from DB:', rawSettings.contact?.mapUrl);
    
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

    console.log('✅ Transformed settings.contactInfo:', settings.contactInfo);


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

    // Fetch Weather Data from Open-Meteo with daily forecast
    const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=5.1667&longitude=96.8333&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok&forecast_days=7";
    let weather = null;
    try {
      const weatherRes = await fetch(OPEN_METEO_URL, { cache: 'no-store', next: { revalidate: 3600 } });
      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        const weatherDesc = getWeatherDesc(weatherData.current.weather_code);
        
        // Transform daily forecast
        const dailyForecast = weatherData.daily.time.map((date: string, index: number) => ({
          date,
          code: weatherData.daily.weather_code[index],
          maxTemp: Math.round(weatherData.daily.temperature_2m_max[index]),
          minTemp: Math.round(weatherData.daily.temperature_2m_min[index]),
        }));

        weather = {
          city: 'Peusangan',
          temperature: Math.round(weatherData.current.temperature_2m),
          condition: weatherDesc.label,
          icon: weatherDesc.icon,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: weatherData.current.wind_speed_10m,
          daily: dailyForecast,
        };
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }

    // Fetch Latest Earthquake
    let earthquake = null;
    try {
      const gempa = await prisma.earthquake.findFirst({
        orderBy: { datetime: 'desc' }
      });
      if (gempa) {
        earthquake = {
          magnitude: gempa.magnitude,
          location: gempa.location,
          date: gempa.date,
          time: gempa.time,
          depth: gempa.depth,
          shakemap: gempa.shakemap || undefined,
          coordinates: gempa.coordinates,
          potential: gempa.potential,
        };
      }
    } catch (error) {
      console.error('Error fetching earthquake:', error);
    }

    return {
      stats,
      news,
      umkm,
      projects,
      settings,
      structure: structureData?.structure || { level1: [], level4: [] },
      disaster: disasterData,
      weather,
      earthquake,
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
      disaster: null,
      weather: null,
      earthquake: null,
    };
  }
}

export default async function LandingPage() {
  const { stats, news, umkm, projects, settings, structure, disaster, weather, earthquake } = await getData();

  return (
    <div className="min-h-screen">
      <DisasterAlert disaster={disaster} />
      <HeroSection settings={settings} />
      <InfoBar weather={weather} earthquake={earthquake} />
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
