import Link from 'next/link';

export default function OnlineServices() {
  return (
    <section id="layanan" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Layanan Surat Online</h2>
          <p className="text-gray-600">Ajukan permohonan surat secara online, mudah dan cepat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pilih Jenis Surat</h3>
            <p className="text-gray-600">Pilih jenis surat yang Anda butuhkan dari template yang tersedia</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Isi Formulir</h3>
            <p className="text-gray-600">Lengkapi formulir permohonan dengan data yang diperlukan</p>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tunggu & Download</h3>
            <p className="text-gray-600">Tunggu persetujuan dan download surat Anda dalam format PDF</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/layanan-surat"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Mulai Ajukan Surat
            <svg className="w-6 h-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
