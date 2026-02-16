import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';
import ToastProvider from '@/components/ToastProvider';
import NextTopLoader from 'nextjs-toploader';

import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

const outfit = Outfit({
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    const rawSettings = settings?.settings as any || {};
    const favicon = rawSettings?.branding?.favicon || '/favicon.ico';
    const siteName = rawSettings?.general?.siteName || 'Desa Mata Mamplam';

    return {
      title: {
        template: `%s | ${siteName}`,
        default: siteName,
      },
      description: rawSettings?.general?.description || 'Website resmi pemerintahan desa',
      icons: {
        icon: favicon,
      },
      verification: {
        google: 'kHYQHSlDSv119nFDThYj7lKT9b7AzICrdg8czc88h-g',
      },
    };
  } catch (error) {
    console.error('Failed to fetch settings for metadata:', error);
    return {
      title: 'Desa Mata Mamplam',
      description: 'Website resmi pemerintahan desa',
      icons: {
        icon: '/favicon.ico',
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider>
          <SettingsProvider>
            <SidebarProvider>
              <NextTopLoader showSpinner={false} color="#2563EB" />
              {children}
              <ToastProvider />
            </SidebarProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
