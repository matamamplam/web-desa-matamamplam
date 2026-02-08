import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

async function getSettings() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/public/settings`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    const rawSettings = data.settings || data;
    
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

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <PublicNavbar
        siteName={settings?.general?.siteName}
        logo={settings?.branding?.logo}
      />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>

      {/* Footer */}
      <PublicFooter settings={settings || undefined} />
    </div>
  );
}
