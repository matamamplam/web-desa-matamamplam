import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

import { getPublicSettings } from '@/lib/data-public';

async function getSettings() {
  try {
    const settingsData = await getPublicSettings();
    
    if (!settingsData) {
      return null;
    }
    
    // The helper returns the Prisma record (which has a 'settings' field)
    // or a default object wrapper (which also has a 'settings' field)
    // We cast to any because the JSON field type in Prisma is generic
    const rawSettings = (settingsData as any).settings || {};
    
    // Transform to expected format
    return {
      general: rawSettings.general || {},
      branding: rawSettings.branding || {},
      contactInfo: {
        phone: rawSettings.contact?.phone || '',
        email: rawSettings.contact?.email || '',
        address: rawSettings.contact?.address || '',
        mapEmbedUrl: rawSettings.contact?.mapUrl || '',
      },
      footer: rawSettings.footer || {},
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export default async function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <PublicNavbar
        siteName={settings?.general?.siteName}
        logo={settings?.branding?.logo}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <PublicFooter settings={settings || undefined} />
    </div>
  );
}
