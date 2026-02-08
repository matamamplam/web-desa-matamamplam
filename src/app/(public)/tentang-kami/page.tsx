import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { SiteSettings } from '@/types/settings';

async function getSettings(): Promise<SiteSettings | null> {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings?.settings) return null;
  return settings.settings as unknown as SiteSettings;
}

export default async function TentangKamiPage() {
  const settings = await getSettings();
  const geography = settings?.geography;

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Tentang Kami</h1>
          <p className="text-xl text-blue-100">Mengenal Desa Mata Mamplam Lebih Dekat</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sejarah */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Sejarah Desa</h2>
          <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: settings?.about?.content || '' }}>
          </div>
          {!settings?.about?.content && (
             <div className="prose prose-lg max-w-none text-gray-600">
             <p className="mb-4">
               Desa Mata Mamplam merupakan salah satu desa yang terletak di Kecamatan Peusangan, Kabupaten Bireuen, 
               Provinsi Aceh. Desa ini memiliki sejarah panjang dan telah menjadi bagian penting dari perkembangan 
               daerah Aceh sejak zaman dahulu.
             </p>
             <p className="mb-4">
               Dengan kearifan lokal dan budaya Aceh yang kuat, masyarakat Desa Mata Mamplam telah mempertahankan 
               tradisi dan nilai-nilai leluhur sambil terus beradaptasi dengan perkembangan zaman modern.
             </p>
           </div>
          )}
        </section>

        {/* Visi Misi */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Visi & Misi</h2>
          
          <div className="bg-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Visi</h3>
            <p className="text-gray-700 leading-relaxed">
              "{settings?.about?.vision || 'Terwujudnya Desa Mata Mamplam yang maju, sejahtera, dan berdaya saing melalui pemanfaatan teknologi digital dan pemberdayaan masyarakat.'}"
            </p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Misi</h3>
            <ul className="space-y-3 text-gray-700">
              {settings?.about?.mission && settings.about.mission.length > 0 ? (
                settings.about.mission.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Meningkatkan kualitas pelayanan publik melalui digitalisasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Memberdayakan masyarakat dalam bidang ekonomi kreatif dan UMKM</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </section>

        {/* Geografis */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Geografis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600">{geography?.location || 'Kecamatan Peusangan, Kabupaten Bireuen, Aceh'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Luas Wilayah</h3>
              <p className="text-gray-600">{geography?.area || '±500 Ha'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Batas Wilayah</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Utara: {geography?.boundaries?.north || 'Desa XXX'}</li>
                <li>Selatan: {geography?.boundaries?.south || 'Desa XXX'}</li>
                <li>Timur: {geography?.boundaries?.east || 'Desa XXX'}</li>
                <li>Barat: {geography?.boundaries?.west || 'Desa XXX'}</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Jumlah Dusun</h3>
              <p className="text-gray-600">{geography?.totalDusun || '4 Dusun'}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
