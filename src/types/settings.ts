export interface SiteSettings {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    heroBackground?: string;
  };
  branding: {
    logo: string;
    letterLogo?: string;
    favicon: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapUrl: string;
    operationalHours?: {
      weekdays: string;
      saturday: string;
      sunday: string;
    };
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
  geography?: {
    location?: string;
    area?: string;
    boundaries?: {
      north?: string;
      south?: string;
      east?: string;
      west?: string;
    };
    totalDusun?: string;
  };
}
