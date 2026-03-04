"use client"

import { useState, useEffect } from "react"
import { FiAlertTriangle, FiCheckCircle, FiMapPin, FiPhone, FiInfo, FiArrowLeft } from "react-icons/fi"
import { useLiveEarthquake } from "@/hooks/useLiveEarthquake"

export default function DisasterPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { earthquake, loading: earthquakeLoading } = useLiveEarthquake()

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch("/api/public/disaster")
            if (res.ok) {
                const json = await res.json()
                setData(json)
            } else {
                setData(null)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const event = data?.event;
  const stats = data?.stats;

  // Safe State (No Active Disaster)
  if (!event) {
    return (
      <div className="min-h-[80vh] bg-gray-50 pb-20 pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Status Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6 ring-8 ring-green-50">
                    <FiCheckCircle size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Aman Terkendali</h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Saat ini tidak ada laporan bencana aktif di wilayah Desa Mata Mamplam. Tetap waspada dan pantau informasi terkini.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Earthquake Card */}
                    {earthquakeLoading ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        </div>
                    ) : earthquake && (
                        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row gap-6 p-6 ${earthquake.isWarning ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-gray-100'}`}>
                            {/* Left: Shakemap */}
                            <div className="flex-shrink-0 w-full md:w-1/3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                {earthquake.shakemap ? (
                                    <img src={`https://data.bmkg.go.id/DataMKG/TEWS/${earthquake.shakemap}`} alt="Shakemap Gempa" className="w-full h-auto object-cover" />
                                ) : (
                                    <div className="h-full w-full min-h-[200px] flex items-center justify-center p-8 text-gray-400">Peta tidak tersedia</div>
                                )}
                            </div>
                        
                            {/* Right: Info */}
                            <div className="flex-1 flex flex-col justify-center space-y-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Gempa Bumi Terkini</h2>
                                    <p className="text-gray-500 text-sm">{earthquake.date}, {earthquake.time}</p>
                                </div>
                        
                                <div>
                                    <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 font-semibold text-sm rounded-full">
                                        {earthquake.potential || "Gempa Dirasakan"}
                                    </span>
                                </div>
                        
                                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                                    {earthquake.location.toLowerCase().startsWith("pusat gempa") ? earthquake.location : `Pusat gempa berada di ${earthquake.location.replace(/pusat gempa berada di /i, '')}`}
                                </h3>
                        
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Magnitudo */}
                                    <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                        <span className="text-gray-500 text-xs mb-1">Magnitudo:</span>
                                        <div className="flex items-center text-gray-900 font-bold text-lg">
                                            <span className="text-red-500 mr-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </span> 
                                            {earthquake.magnitude}
                                        </div>
                                    </div>
                                    {/* Kedalaman */}
                                    <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                        <span className="text-gray-500 text-xs mb-1">Kedalaman:</span>
                                        <div className="flex items-center text-gray-900 font-bold text-lg">
                                            <span className="text-green-500 mr-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </span> 
                                            {earthquake.depth}
                                        </div>
                                    </div>
                                    {/* Koordinat Lokasi */}
                                    <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                        <span className="text-gray-500 text-xs mb-1">Koordinat Lokasi:</span>
                                        <div className="flex items-center text-gray-900 font-bold text-sm">
                                            <span className="text-orange-500 mr-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            </span> 
                                            {earthquake.lintang} - {earthquake.bujur}
                                        </div>
                                    </div>
                                </div>
                        
                                <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-semibold text-blue-600">Saran BMKG:</span> Hati-hati terhadap gempabumi susulan yang mungkin terjadi
                                </p>
                                
                                {earthquake.dirasakan && earthquake.dirasakan !== "-" && (
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-orange-600">Dirasakan:</span> {earthquake.dirasakan}
                                    </p>
                                )}
                        
                                {/* Bireuen Warning Overrides */}
                                {earthquake.isWarning && (
                                    <div className="text-sm mt-3 p-3 rounded-lg bg-red-50 border border-red-500 text-red-700 font-bold flex items-center shadow-sm animate-pulse">
                                        <span className="mr-2 text-xl">🚨</span> PERINGATAN: Gempa Signifikan / Potensi Tsunami dekat Bireuen!
                                    </div>
                                )}
                                {earthquake.distance !== null && (
                                    <div className="text-sm mt-2 p-3 rounded-lg bg-blue-50 border border-blue-500 text-blue-900 font-medium inline-block w-fit">
                                        Jarak pusaran ke Bireuen: ±{Math.round(earthquake.distance)} KM
                                    </div>
                                )}
                        
                                <div className="mt-4">
                                    <a href="https://warning.bmkg.go.id/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center transition-colors">
                                        Lihat Semuanya <span className="ml-1">→</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Windy Map Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                <span className="text-xl mr-2">🌬️</span> Prakiraan Angin & Cuaca
                            </h2>
                        </div>
                        <div className="h-[400px] w-full bg-gray-100 relative">
                             <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://embed.windy.com/embed2.html?lat=5.1667&lon=96.8333&detailLat=5.1667&detailLon=96.8333&width=650&height=450&zoom=8&level=surface&overlay=gustAccu&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" 
                                frameBorder="0"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                    {/* Quick Contacts */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <FiPhone className="mr-2 text-red-600" /> Kontak Darurat
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600">Polisi</span>
                                <span className="font-mono font-bold text-gray-900">110</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600">Ambulans</span>
                                <span className="font-mono font-bold text-gray-900">118</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-600">Kantor Desa</span>
                                <span className="font-mono font-bold text-gray-900 text-sm">(0123) 456-7890</span>
                            </div>
                        </div>
                    </div>

                    {/* Education Card */}
                    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 bg-white/10 w-32 h-32 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        <h3 className="font-bold text-lg mb-2 flex items-center relative z-10">
                            <FiInfo className="mr-2" /> Panduan & Edukasi
                        </h3>
                        <p className="text-blue-100 text-sm mb-6 relative z-10">
                            Pelajari langkah-langkah keselamatan dan mitigasi bencana untuk melindungi diri dan keluarga.
                        </p>
                         <a href="/bencana/edukasi" className="inline-block w-full text-center bg-white text-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-50 transition-colors shadow-sm relative z-10">
                            Pelajari Sekarang
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    )
  }

  // Active State Render
  return (
    <div className="pb-20">
      {/* Hero / Alert Banner */}
      <section className="bg-red-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
           <div className="inline-flex items-center justify-center p-3 bg-red-800 rounded-full mb-6 animate-pulse">
              <FiAlertTriangle size={32} />
           </div>
           <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider">
              {event.title}
           </h1>
           <p className="text-xl md:text-2xl opacity-90 font-medium max-w-3xl mx-auto bg-red-700/50 py-2 px-6 rounded-lg backdrop-blur-sm">
              Status: SIAGA DARURAT
           </p>
           <p className="mt-4 text-red-100 max-w-2xl mx-auto">
              Lokasi: {event.location}
           </p>
           <p className="mt-6 text-lg max-w-4xl mx-auto bg-white/10 p-6 rounded-xl border border-white/20">
              &quot;{event.description}&quot;
           </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
         {/* Statistics */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
               { label: "Warga Mengungsi", value: getStatValue(stats, "DISPLACED"), color: "bg-orange-600" },
               { label: "Posko Aktif", value: event.posts?.length || 0, color: "bg-green-600" },
               { label: "Kerusakan", value: event._count?.damage || 0, color: "bg-red-700" },
               { label: "Butuh Bantuan", value: getStatValue(stats, "NEEDS_HELP"), color: "bg-blue-600" },
            ].map((stat, idx) => (
                <div key={idx} className={`${stat.color} text-white p-6 rounded-xl shadow-lg text-center transform hover:scale-105 transition-transform`}>
                    <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm md:text-base opacity-90">{stat.label}</div>
                </div>
            ))}
         </div>
         
         <div className="grid lg:grid-cols-3 gap-8 items-start mb-12">
            {/* Command Posts List (Main Content - Left) */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        <FiMapPin className="mr-2 text-red-600" />
                        Lokasi Posko Pengungsian & Bantuan
                     </h2>
                  </div>
                  {/* Fixed Height Scrollable Posko List */}
                  <div className="divide-y divide-gray-100 max-h-[800px] overflow-y-auto custom-scrollbar">
                     {event.posts && event.posts.length > 0 ? (
                        event.posts.map((post: any) => (
                           <div key={post.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-colors">
                              {post.photo && (
                                 <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                     <img src={post.photo} alt={post.name} className="w-full h-full object-cover" />
                                 </div>
                              )}
                              <div className="flex-1">
                                 <h3 className="text-lg font-bold text-gray-900 mb-2">{post.name}</h3>
                                 <p className="text-gray-600 mb-3 flex items-start">
                                    <FiMapPin className="mt-1 mr-2 text-gray-400 flex-shrink-0" />
                                    {post.location}
                                 </p>
                                 <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                     <div>
                                        <span className="block text-xs text-gray-400">Koordinator (PIC)</span>
                                        {post.picName} ({post.picPhone})
                                     </div>
                                     <div>
                                        <span className="block text-xs text-gray-400">Kapasitas / Terisi</span>
                                        {post.capacity} Orang / {post._count?.refugees || 0} Orang
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                            <div 
                                                className={`h-1.5 rounded-full ${
                                                    ((post._count?.refugees || 0) / (post.capacity || 1) * 100) > 90 ? 'bg-red-500' : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min(((post._count?.refugees || 0) / (post.capacity || 1) * 100), 100)}%` }}
                                            ></div>
                                        </div>
                                     </div>
                                 </div>
                                 {post.facilities && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                       {post.facilities.split(',').map((f: string, i: number) => (
                                          <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                                             {f.trim()}
                                          </span>
                                       ))}
                                    </div>
                                 )}
                                 {post.mapEmbedUrl ? (
                                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200"
                                       dangerouslySetInnerHTML={{ 
                                          __html: post.mapEmbedUrl.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="200"') 
                                       }}
                                    />
                                 ) : (post.latitude && post.longitude) && (
                                    <a 
                                      href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
                                      target="_blank"
                                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
                                    >
                                       Buka di Google Maps &rarr;
                                    </a>
                                 )}

                                 {/* Logistics Section */}
                                 {post.logistics && post.logistics.length > 0 && (
                                    <div className="mt-5 pt-4 border-t border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                                            Stok Logistik Tersedia
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {post.logistics.map((log: any, idx: number) => (
                                                <div key={idx} className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-colors">
                                                    <div className="min-w-0 flex-1 mr-2">
                                                        <span className="text-gray-700 font-medium text-xs block truncate" title={log.itemName}>{log.itemName}</span>
                                                        {log.type && <span className="text-[10px] text-gray-400 uppercase tracking-wider">{log.type}</span>}
                                                    </div>
                                                    <span className="font-bold text-blue-700 bg-white px-2 py-1 rounded border border-blue-50 text-xs shadow-sm whitespace-nowrap">
                                                        {log.currentStock} {log.unit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="p-8 text-center text-gray-500">
                           Belum ada data posko yang ditampilkan.
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Sidebar Information (Sticky Right) */}
            <div className="space-y-6 lg:sticky lg:top-24 h-fit">

               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                     <a href="/bencana/edukasi" className="flex items-center justify-between p-4 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors group">
                        <div className="flex items-center">
                           <FiInfo className="mr-3" size={20}/>
                           <span className="font-bold">Panduan Keselamatan</span>
                        </div>
                        <FiArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                     </a>
               </div>

               <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center"><FiPhone className="mr-2"/> Layanan Darurat</h3>
                  <div className="space-y-3">
                      {[{n: "Polisi", p: "110"}, {n: "Pemadam", p: "113"}, {n: "Ambulans", p: "118"}, {n: "SAR", p: "115"}].map((c) => (
                         <div key={c.n} className="flex justify-between items-center bg-white/10 p-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer backdrop-blur-sm">
                             <span className="font-medium">{c.n}</span>
                             <span className="font-mono font-bold text-xl tracking-wider">{c.p}</span>
                         </div>
                      ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Damage Reports Section */}
         <div className="mt-12 mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-red-700 flex items-center">
                     <FiAlertTriangle className="mr-2" />
                     Laporan Kerusakan & Dampak
                  </h2>
                  <span className="text-sm text-gray-500">{event.damage?.length || 0} Laporan</span>
               </div>
               
               {/* Fixed Height Scrollable Grid for Damage Reports */}
               <div className="max-h-[800px] overflow-y-auto custom-scrollbar p-6">
                   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                       {event.damage && event.damage.length > 0 ? (
                           event.damage.map((item: any) => (
                              <div key={item.id} className="group bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                 {item.photo ? (
                                     <div className="h-48 bg-gray-200 relative overflow-hidden">
                                         <img src={item.photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                         <div className="absolute top-2 right-2">
                                             <span className={`px-2 py-1 text-xs font-bold rounded uppercase shadow-sm ${
                                                 item.severity === "SEVERE" || item.severity === "TOTAL_LOSS" ? "bg-red-600 text-white" :
                                                 item.severity === "MODERATE" ? "bg-yellow-500 text-white" :
                                                 "bg-blue-500 text-white"
                                             }`}>
                                                 {item.severity === "SEVERE" ? "Berat" : item.severity === "TOTAL_LOSS" ? "Hancur Total" : item.severity === "MODERATE" ? "Sedang" : "Ringan"}
                                             </span>
                                         </div>
                                     </div>
                                 ) : (
                                    <div className="h-48 bg-gray-50 flex items-center justify-center text-gray-300">
                                       <FiAlertTriangle size={32} />
                                    </div>
                                 )}
                                 <div className="p-5">
                                     <h3 className="font-bold text-gray-900 mb-2 truncate" title={item.title}>{item.title}</h3>
                                     <p className="text-gray-500 text-xs mb-3 flex items-center"><FiMapPin className="mr-1" size={10}/>{item.location}</p>
                                     <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">{item.description}</p>
                                 </div>
                              </div>
                           ))
                       ) : (
                           <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <FiCheckCircle size={32} className="mx-auto mb-2 opacity-50"/>
                                <p>Belum ada laporan kerusakan yang tercatat.</p>
                           </div>
                       )}
                   </div>
               </div>
            </div>
         </div>

         {/* Windy Map Card (Bottom) */}
         {/* Earthquake & Windy Maps Section (Bottom) */}
         <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Earthquake Card */}
            {earthquakeLoading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse h-fit">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                </div>
            ) : earthquake && (
                <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row gap-6 p-6 lg:col-span-2 ${earthquake.isWarning ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'border-gray-100'}`}>
                    {/* Left: Shakemap */}
                    <div className="flex-shrink-0 w-full md:w-1/3 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                        {earthquake.shakemap ? (
                            <img src={`https://data.bmkg.go.id/DataMKG/TEWS/${earthquake.shakemap}`} alt="Shakemap Gempa" className="w-full h-auto object-cover" />
                        ) : (
                            <div className="h-full w-full min-h-[200px] flex items-center justify-center p-8 text-gray-400">Peta tidak tersedia</div>
                        )}
                    </div>
                
                    {/* Right: Info */}
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Gempa Bumi Terkini</h2>
                            <p className="text-gray-500 text-sm">{earthquake.date}, {earthquake.time}</p>
                        </div>
                
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 font-semibold text-sm rounded-full">
                                {earthquake.potential || "Gempa Dirasakan"}
                            </span>
                        </div>
                
                        <h3 className="text-xl font-bold text-gray-900 leading-snug">
                            {earthquake.location.toLowerCase().startsWith("pusat gempa") ? earthquake.location : `Pusat gempa berada di ${earthquake.location.replace(/pusat gempa berada di /i, '')}`}
                        </h3>
                
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Magnitudo */}
                            <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                <span className="text-gray-500 text-xs mb-1">Magnitudo:</span>
                                <div className="flex items-center text-gray-900 font-bold text-lg">
                                    <span className="text-red-500 mr-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    </span> 
                                    {earthquake.magnitude}
                                </div>
                            </div>
                            {/* Kedalaman */}
                            <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                <span className="text-gray-500 text-xs mb-1">Kedalaman:</span>
                                <div className="flex items-center text-gray-900 font-bold text-lg">
                                    <span className="text-green-500 mr-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </span> 
                                    {earthquake.depth}
                                </div>
                            </div>
                            {/* Koordinat Lokasi */}
                            <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-start bg-white">
                                <span className="text-gray-500 text-xs mb-1">Koordinat Lokasi:</span>
                                <div className="flex items-center text-gray-900 font-bold text-sm">
                                    <span className="text-orange-500 mr-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </span> 
                                    {earthquake.lintang} - {earthquake.bujur}
                                </div>
                            </div>
                        </div>
                
                        <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold text-blue-600">Saran BMKG:</span> Hati-hati terhadap gempabumi susulan yang mungkin terjadi
                        </p>
                        
                        {earthquake.dirasakan && earthquake.dirasakan !== "-" && (
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-orange-600">Dirasakan:</span> {earthquake.dirasakan}
                            </p>
                        )}
                
                        {/* Bireuen Warning Overrides */}
                        {earthquake.isWarning && (
                            <div className="text-sm mt-3 p-3 rounded-lg bg-red-50 border border-red-500 text-red-700 font-bold flex items-center shadow-sm animate-pulse">
                                <span className="mr-2 text-xl">🚨</span> PERINGATAN: Gempa Signifikan / Potensi Tsunami dekat Bireuen!
                            </div>
                        )}
                        {earthquake.distance !== null && (
                            <div className="text-sm mt-2 p-3 rounded-lg bg-blue-50 border border-blue-500 text-blue-900 font-medium inline-block w-fit">
                                Jarak pusaran ke Bireuen: ±{Math.round(earthquake.distance)} KM
                            </div>
                        )}
                
                        <div className="mt-4">
                            <a href="https://warning.bmkg.go.id/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center transition-colors">
                                Lihat Semuanya <span className="ml-1">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Windy Map Card */}
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${!earthquake ? 'lg:col-span-2' : ''}`}>
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <span className="text-xl mr-2">🌬️</span> Prakiraan Cuaca
                    </h2>
                </div>
                <div className="h-[300px] w-full bg-gray-100 relative">
                        <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://embed.windy.com/embed2.html?lat=5.1667&lon=96.8333&detailLat=5.1667&detailLon=96.8333&width=650&height=450&zoom=8&level=surface&overlay=gustAccu&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1" 
                        frameBorder="0"
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function getStatValue(stats: any[], condition: string) {
   if (!stats) return 0
   const stat = stats.find(s => s.condition === condition)
   return stat ? stat._count._all : 0
}
