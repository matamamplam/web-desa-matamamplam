interface Settings {
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    mapEmbedUrl?: string;
  };
}

export default function VillageMap({ settings }: { settings: Settings }) {
  const mapUrl = settings.contactInfo?.mapEmbedUrl;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Lokasi Desa</h2>
          <p className="text-gray-600">Temukan kami di peta</p>
        </div>

        {mapUrl ? (
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center shadow-xl">
            <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 font-semibold mb-2">Peta Belum Tersedia</p>
            {settings.contactInfo?.address && (
              <p className="text-gray-500 text-sm max-w-md text-center px-4">
                {settings.contactInfo.address}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
