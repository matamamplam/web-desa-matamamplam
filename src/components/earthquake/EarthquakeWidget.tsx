import { prisma } from "@/lib/prisma"
import Image from "next/image"

async function getLatestEarthquake() {
  return await prisma.earthquake.findFirst({
    orderBy: { datetime: 'desc' }
  })
}

export default async function EarthquakeWidget() {
  const gempa = await getLatestEarthquake()

  if (!gempa) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Info Gempa Terkini</h3>
            <p className="text-gray-500 text-sm">Belum ada data gempa.</p>
        </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-red-600 px-6 py-3 flex justify-between items-center">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
           Info Gempa Terkini
        </h3>
        <span className="text-red-100 text-xs bg-red-700 px-2 py-1 rounded-full">
            BMKG
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
            {/* Map Image */}
            <div className="relative w-full md:w-1/3 aspect-video md:aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                {gempa.shakemap ? (
                     <Image 
                        src={`https://data.bmkg.go.id/DataMKG/TEWS/${gempa.shakemap}`}
                        alt="Peta Guncangan Gempa"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                     />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                        <p className="text-xs text-orange-600 font-medium uppercase tracking-wider">Magnitudo</p>
                        <p className="text-2xl font-bold text-gray-900">{gempa.magnitude}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                         <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Kedalaman</p>
                         <p className="text-2xl font-bold text-gray-900">{gempa.depth}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 col-span-2">
                         <p className="text-xs text-purple-600 font-medium uppercase tracking-wider">Waktu</p>
                         <p className="text-lg font-bold text-gray-900">{gempa.date}, {gempa.time}</p>
                    </div>
                </div>

                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Lokasi</p>
                    <p className="text-gray-900 font-medium leading-relaxed">{gempa.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Koord: {gempa.lintang} - {gempa.bujur}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-sm font-medium text-gray-900">{gempa.potential}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
