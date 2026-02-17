import Link from 'next/link';
import { FiArrowLeft, FiShield, FiAlertTriangle, FiLifeBuoy, FiPhone } from 'react-icons/fi';

export const metadata = {
  title: 'Edukasi & Mitigasi Bencana',
  description: 'Panduan keselamatan dan mitigasi bencana untuk warga Gampong Mata Mamplam.',
};

export default function EdukasiPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
            <Link href="/bencana" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-4 transition-colors">
                <FiArrowLeft className="mr-2" /> Kembali ke Info Bencana
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edukasi & Mitigasi Bencana</h1>
            <p className="text-gray-600 mt-2 text-lg">Panduan keselamatan untuk warga Desa Mata Mamplam dalam menghadapi situasi darurat.</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
            
            {/* Gempa Bumi */}
            <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center">
                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mr-4">
                        <FiAlertTriangle size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Gempa Bumi</h2>
                </div>
                <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3">Saat Terjadi Gempa</h3>
                            <ul className="space-y-3">
                                {[
                                    "Jika di dalam rumah, berlindung di bawah meja yang kokoh.",
                                    "Lindungi kepala dengan bantal atau tangan.",
                                    "Jauhi kaca, lemari, dan benda yang mudah jatuh.",
                                    "Jika di luar, jauhi bangunan, tiang listrik, dan pohon.",
                                    "Jangan menggunakan lift atau tangga darurat saat guncangan."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="bg-orange-100 text-orange-700 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">{i+1}</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3">Setelah Gempa</h3>
                            <ul className="space-y-3">
                                {[
                                    "Periksa apakah ada luka atau cedera.",
                                    "Waspada gempa susulan.",
                                    "Hindari masuk ke bangunan yang sudah retak parah.",
                                    "Pantau informasi dari BMKG atau aparat desa.",
                                    "Berkumpul di titik kumpul evakuasi desa."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start text-gray-600 text-sm">
                                        <span className="bg-green-100 text-green-700 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">{i+1}</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Banjir */}
            <section className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-4">
                        <FiLifeBuoy size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Banjir</h2>
                </div>
                <div className="p-6">
                     <ul className="space-y-3">
                        {[
                            "Simpan dokumen penting di tempat tinggi dan kedap air.",
                            "Matikan aliran listrik jika air mulai masuk rumah.",
                            "Siapkan tas siaga bencana (obat, senter, pakaian, makanan).",
                            "Ikuti arahan evakuasi dari petugas jika air semakin tinggi.",
                            "Jangan berjalan di arus air yang deras."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start text-gray-600 text-sm">
                                <span className="bg-blue-100 text-blue-700 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 flex-shrink-0 mt-0.5">✓</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Emergency Numbers */}
             <section className="bg-gray-900 rounded-2xl shadow-lg text-white p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FiPhone className="mr-3 text-red-500" /> Nomor Darurat
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">Ambulans</p>
                        <p className="text-2xl font-mono font-bold">118</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">Polisi</p>
                        <p className="text-2xl font-mono font-bold">110</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">Pemadam Kebakaran</p>
                        <p className="text-2xl font-mono font-bold">113</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                        <p className="text-gray-400 text-sm mb-1">PLN</p>
                        <p className="text-2xl font-mono font-bold">123</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/10 col-span-full md:col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Kantor Desa Mata Mamplam</p>
                        <p className="text-2xl font-mono font-bold">(0123) 456-7890</p>
                    </div>
                </div>
             </section>

        </div>
      </div>
    </div>
  );
}
