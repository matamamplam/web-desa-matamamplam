'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the settings type
export interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
  };
  branding: {
    logo: string;
    favicon: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapUrl: string;
  };
  about: {
    title: string;
    content: string;
    vision: string;
    mission: string[];
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  footer: {
    description: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
    };
    copyright: string;
  };
  navigation: {
    externalLinks: Array<{
      label: string;
      url: string;
      openInNewTab: boolean;
    }>;
  };
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  general: {
    siteName: 'Website Desa',
    tagline: '',
    description: '',
  },
  branding: {
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico',
  },
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    mapUrl: '',
  },
  about: {
    title: '',
    content: '',
    vision: '',
    mission: [],
  },
  faq: [],
  footer: {
    description: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
    },
    copyright: '© 2024 Website Desa. All rights reserved.',
  },
  navigation: {
    externalLinks: [],
  },
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
  refreshSettings: async () => {},
});

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/public/settings', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings || defaultSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSettings(defaultSettings); // Use defaults on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider
      value={{ settings, loading, error, refreshSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
