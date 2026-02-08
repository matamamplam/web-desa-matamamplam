'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

import { SiteSettings } from '@/types/settings';

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast.success('Pengaturan berhasil disimpan!');
      // Refresh page to apply new settings
      window.location.reload();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (path: string[], value: any) => {
    if (!settings) return;

    const newSettings = { ...settings };
    let current: any = newSettings;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }

    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  const addFAQ = () => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.faq.push({ question: '', answer: '' });
    setSettings(newSettings);
  };

  const removeFAQ = (index: number) => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.faq.splice(index, 1);
    setSettings(newSettings);
  };

  const addExternalLink = () => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.navigation.externalLinks.push({
      label: '',
      url: '',
      openInNewTab: true,
    });
    setSettings(newSettings);
  };

  const removeExternalLink = (index: number) => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.navigation.externalLinks.splice(index, 1);
    setSettings(newSettings);
  };

  const addMission = () => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.about.mission.push('');
    setSettings(newSettings);
  };

  const removeMission = (index: number) => {
    if (!settings) return;
    const newSettings = { ...settings };
    newSettings.about.mission.splice(index, 1);
    setSettings(newSettings);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'Umum', icon: '??' },
    { id: 'branding', label: 'Branding', icon: '??' },
    { id: 'contact', label: 'Kontak', icon: '??' },
    { id: 'about', label: 'Tentang', icon: '??' },
    { id: 'geography', label: 'Geografis', icon: '???' },
    { id: 'faq', label: 'FAQ', icon: '?' },
    { id: 'footer', label: 'Footer', icon: '??' },
    { id: 'navigation', label: 'Navigasi', icon: '??' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pengaturan Website
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola pengaturan website secara dinamis
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Pengaturan Umum
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Situs
                  </label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings(['general', 'siteName'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.general.tagline}
                    onChange={(e) => updateSettings(['general', 'tagline'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={settings.general.description}
                    onChange={(e) => updateSettings(['general', 'description'], e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Background Image
                  </label>
                  <ImageUpload
                    value={settings.general.heroBackground || ''}
                    onChange={(value) => updateSettings(['general', 'heroBackground'], value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gambar background untuk hero section halaman utama. Rekomendasi: Landscape 1920x1080px
                  </p>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Branding
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo
                  </label>
                  <ImageUpload
                    value={settings.branding.logo}
                    onChange={(value) => updateSettings(['branding', 'logo'], value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rekomendasi: PNG dengan background transparan, ukuran 200x200px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo Kop Surat
                  </label>
                  <ImageUpload
                    value={settings.branding.letterLogo || ''}
                    onChange={(value) => updateSettings(['branding', 'letterLogo'], value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Logo khusus untuk kop surat. Jika kosong, akan menggunakan logo utama.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon
                  </label>
                  <ImageUpload
                    value={settings.branding.favicon}
                    onChange={(value) => updateSettings(['branding', 'favicon'], value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rekomendasi: ICO atau PNG, ukuran 32x32px atau 64x64px
                  </p>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Informasi Kontak
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact.email}
                    onChange={(e) => updateSettings(['contact', 'email'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telepon
                  </label>
                  <input
                    type="text"
                    value={settings.contact.phone}
                    onChange={(e) => updateSettings(['contact', 'phone'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settings.contact.whatsapp}
                    onChange={(e) => updateSettings(['contact', 'whatsapp'], e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={settings.contact.address}
                    onChange={(e) => updateSettings(['contact', 'address'], e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    value={settings.contact.mapUrl}
                    onChange={(e) => updateSettings(['contact', 'mapUrl'], e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Buka Google Maps, klik Share ? Embed a map ? Copy HTML ? Paste URL di sini
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Jam Operasional</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Senin - Jumat
                      </label>
                      <input
                        type="text"
                        value={settings.contact.operationalHours?.weekdays || '08:00 - 16:00'}
                        onChange={(e) => {
                           const currentOps = settings.contact.operationalHours || { weekdays: '', saturday: '', sunday: '' };
                           updateSettings(['contact', 'operationalHours'], { ...currentOps, weekdays: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Sabtu
                      </label>
                      <input
                        type="text"
                        value={settings.contact.operationalHours?.saturday || '08:00 - 12:00'}
                        onChange={(e) => {
                           const currentOps = settings.contact.operationalHours || { weekdays: '', saturday: '', sunday: '' };
                           updateSettings(['contact', 'operationalHours'], { ...currentOps, saturday: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Minggu & Libur
                      </label>
                      <input
                        type="text"
                        value={settings.contact.operationalHours?.sunday || 'Tutup'}
                        onChange={(e) => {
                           const currentOps = settings.contact.operationalHours || { weekdays: '', saturday: '', sunday: '' };
                           updateSettings(['contact', 'operationalHours'], { ...currentOps, sunday: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Tentang Kami
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={settings.about.title}
                    onChange={(e) => updateSettings(['about', 'title'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Konten (HTML supported)
                  </label>
                  <textarea
                    value={settings.about.content}
                    onChange={(e) => updateSettings(['about', 'content'], e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visi
                  </label>
                  <textarea
                    value={settings.about.vision}
                    onChange={(e) => updateSettings(['about', 'vision'], e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Misi
                  </label>
                  {settings.about.mission.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newMission = [...settings.about.mission];
                          newMission[index] = e.target.value;
                          updateSettings(['about', 'mission'], newMission);
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder={`Misi ${index + 1}`}
                      />
                      <button
                        onClick={() => removeMission(index)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        ?
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addMission}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Tambah Misi
                  </button>
                </div>
              </div>
            )}

            {/* Geography Tab */}
            {activeTab === 'geography' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Data Geografis
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    value={settings.geography?.location || ''}
                    onChange={(e) => {
                      const newSettings = {...settings, geography: {...settings.geography, location: e.target.value}};
                      setSettings(newSettings);
                    }}
                    placeholder="Kecamatan Peusangan, Kabupaten Bireuen, Aceh"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Luas Wilayah
                  </label>
                  <input
                    type="text"
                    value={settings.geography?.area || ''}
                    onChange={(e) => {
                      const newSettings = {...settings, geography: {...settings.geography, area: e.target.value}};
                      setSettings(newSettings);
                    }}
                    placeholder="500 Ha"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Batas Wilayah
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Utara</label>
                      <input
                        type="text"
                        value={settings.geography?.boundaries?.north || ''}
                        onChange={(e) => {
                          const newSettings = {...settings, geography: {...settings.geography, boundaries: {...settings.geography?.boundaries, north: e.target.value}}};
                          setSettings(newSettings);
                        }}
                        placeholder="Desa XXX"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Selatan</label>
                      <input
                        type="text"
                        value={settings.geography?.boundaries?.south || ''}
                        onChange={(e) => {
                          const newSettings = {...settings, geography: {...settings.geography, boundaries: {...settings.geography?.boundaries, south: e.target.value}}};
                          setSettings(newSettings);
                        }}
                        placeholder="Desa XXX"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Timur</label>
                      <input
                        type="text"
                        value={settings.geography?.boundaries?.east || ''}
                        onChange={(e) => {
                          const newSettings = {...settings, geography: {...settings.geography, boundaries: {...settings.geography?.boundaries, east: e.target.value}}};
                          setSettings(newSettings);
                        }}
                        placeholder="Desa XXX"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Barat</label>
                      <input
                        type="text"
                        value={settings.geography?.boundaries?.west || ''}
                        onChange={(e) => {
                          const newSettings = {...settings, geography: {...settings.geography, boundaries: {...settings.geography?.boundaries, west: e.target.value}}};
                          setSettings(newSettings);
                        }}
                        placeholder="Desa XXX"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jumlah Dusun
                  </label>
                  <input
                    type="text"
                    value={settings.geography?.totalDusun || ''}
                    onChange={(e) => {
                      const newSettings = {...settings, geography: {...settings.geography, totalDusun: e.target.value}};
                      setSettings(newSettings);
                    }}
                    placeholder="4 Dusun"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  FAQ (Frequently Asked Questions)
                </h2>

                {settings.faq.map((item, index) => (
                  <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        FAQ #{index + 1}
                      </h3>
                      <button
                        onClick={() => removeFAQ(index)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Pertanyaan
                        </label>
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => {
                            const newFaq = [...settings.faq];
                            newFaq[index].question = e.target.value;
                            updateSettings(['faq'], newFaq);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Jawaban
                        </label>
                        <textarea
                          value={item.answer}
                          onChange={(e) => {
                            const newFaq = [...settings.faq];
                            newFaq[index].answer = e.target.value;
                            updateSettings(['faq'], newFaq);
                          }}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addFAQ}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Tambah FAQ
                </button>
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === 'footer' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Footer
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deskripsi Footer
                  </label>
                  <textarea
                    value={settings.footer.description}
                    onChange={(e) => updateSettings(['footer', 'description'], e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Media Sosial
                  </label>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={settings.footer.socialMedia.facebook}
                        onChange={(e) => updateSettings(['footer', 'socialMedia', 'facebook'], e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={settings.footer.socialMedia.instagram}
                        onChange={(e) => updateSettings(['footer', 'socialMedia', 'instagram'], e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={settings.footer.socialMedia.twitter}
                        onChange={(e) => updateSettings(['footer', 'socialMedia', 'twitter'], e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        YouTube
                      </label>
                      <input
                        type="text"
                        value={settings.footer.socialMedia.youtube}
                        onChange={(e) => updateSettings(['footer', 'socialMedia', 'youtube'], e.target.value)}
                        placeholder="https://youtube.com/@..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Copyright
                  </label>
                  <input
                    type="text"
                    value={settings.footer.copyright}
                    onChange={(e) => updateSettings(['footer', 'copyright'], e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Navigasi Eksternal
                </h2>

                {settings.navigation.externalLinks.map((link, index) => (
                  <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Link #{index + 1}
                      </h3>
                      <button
                        onClick={() => removeExternalLink(index)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...settings.navigation.externalLinks];
                            newLinks[index].label = e.target.value;
                            updateSettings(['navigation', 'externalLinks'], newLinks);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL
                        </label>
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...settings.navigation.externalLinks];
                            newLinks[index].url = e.target.value;
                            updateSettings(['navigation', 'externalLinks'], newLinks);
                          }}
                          placeholder="https://..."
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={link.openInNewTab}
                          onChange={(e) => {
                            const newLinks = [...settings.navigation.externalLinks];
                            newLinks[index].openInNewTab = e.target.checked;
                            updateSettings(['navigation', 'externalLinks'], newLinks);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Buka di tab baru
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addExternalLink}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Tambah Link Eksternal
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

