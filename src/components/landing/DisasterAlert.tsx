

import Link from "next/link"
import { FiAlertTriangle } from "react-icons/fi"

export default function DisasterAlert({ disaster }: { disaster: any }) {
  if (!disaster || !disaster.event) return null

  return (
    <div className="bg-red-600 text-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 animate-pulse">
            <div className="bg-white p-2 text-red-600 rounded-full">
                <FiAlertTriangle size={24} />
            </div>
            <div>
                <span className="bg-red-800 text-xs font-bold px-2 py-0.5 rounded uppercase">Darurat</span>
                <p className="font-bold text-lg leading-tight mt-0.5">{disaster.event.title}</p>
                 <p className="text-red-100 text-sm">{disaster.event.location}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto text-sm">
             <div className="text-center min-w-[80px]">
                 <span className="block font-bold text-xl">{disaster.stats?.find((s:any) => s.condition === "DISPLACED")?._count._all || 0}</span>
                 <span className="text-red-200 text-xs">Pengungsi</span>
             </div>
             <div className="text-center min-w-[80px]">
                 <span className="block font-bold text-xl">{disaster.event.posts?.length || 0}</span>
                 <span className="text-red-200 text-xs">Posko</span>
             </div>
             <Link 
                href="/bencana"
                className="px-6 py-2 bg-white text-red-700 font-bold rounded-full shadow-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
             >
                Lihat Detail & Bantuan &rarr;
             </Link>
        </div>
      </div>
    </div>
  )
}
