import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';

import { getPublicSettings } from '@/lib/data-public';


// Use ISR for better performance - cache and revalidate every 60 seconds
export const revalidate = 60;


async function getSettings() {
  try {
    const settings = await getPublicSettings();
    
    if (!settings) {
      return null;
    }
    
    // getPublicSettings now returns the correct structure directly
    return settings;
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
      <PublicFooter settings={settings} />
    </div>
  );
}
