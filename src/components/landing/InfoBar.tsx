'use client';

import { useState } from 'react';

interface InfoBarProps {
  weather: {
    city: string;
    temperature: number;
    condition: string;
    icon: string;
    humidity?: number;
    windSpeed?: number;
    daily?: Array<{
      date: string;
      code: number;
      maxTemp: number;
      minTemp: number;
    }>;
  } | null;
  earthquake: {
    magnitude: string;
    location: string;
    date: string;
    time: string;
    depth: string;
    shakemap?: string;
    coordinates: string;
    potential: string;
  } | null;
}

// Helper to get weather description
function getWeatherDesc(code: number) {
  if (code === 0) return { label: "Cerah", icon: "☀️" }
  if (code >= 1 && code <= 3) return { label: "Berawan", icon: "⛅" }
  if (code >= 45 && code <= 48) return { label: "Kabut", icon: "🌫️" }
  if (code >= 51 && code <= 55) return { label: "Gerimis", icon: "🌦️" }
  if (code >= 61 && code <= 65) return { label: "Hujan", icon: "🌧️" }
  if (code >= 80 && code <= 82) return { label: "Hujan Lebat", icon: "⛈️" }
  if (code >= 95) return { label: "Badai Petir", icon: "⚡" }
  return { label: "Cerah", icon: "☀️" }
}

export default function InfoBar({ weather, earthquake }: InfoBarProps) {
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showEarthquakeModal, setShowEarthquakeModal] = useState(false);

  return (
    <>
      {/* Info Bar - Below Navbar */}
      <div className="bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Weather Info - Left */}
            {weather && (
              <button
                onClick={() => setShowWeatherModal(true)}
                className="flex items-center gap-3 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all group"
              >
                <span className="text-3xl">{weather.icon}</span>
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-xl">{weather.temperature}°C</div>
                  <div className="text-xs text-blue-200">{weather.city}</div>
                </div>
                <svg className="w-4 h-4 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Center Badge */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-white font-medium">Live Info</span>
            </div>

            {/* Earthquake Info - Right */}
            {earthquake && (
              <button
                onClick={() => setShowEarthquakeModal(true)}
                className="flex items-center gap-3 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all group"
              >
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-sm">M{earthquake.magnitude} Gempa Terkini</div>
                  <div className="text-xs text-red-200 truncate max-w-[200px]">{earthquake.location}</div>
                </div>
                <div className="relative">
                  <span className="text-2xl">🌍</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <svg className="w-4 h-4 text-red-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weather Detail Modal (HyperOS Style Refined) */}
      {showWeatherModal && weather && (
        <div 
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md sm:p-4 transition-all duration-300"
          onClick={() => setShowWeatherModal(false)}
        >
          <div 
            className="w-full sm:max-w-md h-[95vh] sm:h-auto sm:max-h-[85vh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl bg-[#0f172a] relative transition-transform transform translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HyperOS Clouds Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#0b0f19] opacity-80 pointer-events-none"></div>
            
            <div className="relative flex flex-col min-h-full overflow-y-auto custom-scrollbar pb-10">
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-8 pb-4 sticky top-0 bg-gradient-to-b from-[#1e293b] to-transparent z-10 transition-colors duration-200 backdrop-blur-[2px]">
                <h3 className="text-xl sm:text-2xl font-medium text-white tracking-wide">{weather.city}</h3>
                <div className="flex gap-4">
                  <button className="text-white/80 hover:text-white" disabled>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button onClick={() => setShowWeatherModal(false)} className="text-white/80 hover:text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Temp & Condition */}
              <div className="flex flex-col items-center justify-center mt-6 mb-8 px-6 text-white text-center">
                 <div className="text-[96px] leading-[1] font-light tracking-tighter ml-6">
                    {weather.temperature}°
                 </div>
                 <div className="text-base text-gray-300 font-medium mt-1">
                    {weather.condition}
                 </div>
              </div>

              {/* Stats Cards (HyperOS Style Grid) */}
              <div className="px-5 mb-8 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    
                    {/* Air Quality (Simulative Static Panel) */}
                    <div className="col-span-2 bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between backdrop-blur-md cursor-default">
                        <div className="flex items-center gap-2">
                           <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="currentColor"><path d="M17 19.22H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2.22h-2V19.22zM21 4.5l-3.5 3.5l-1.41-1.41L18.17 4.5L16.08 2.41L17.5 1h7l-3.5 3.5z"/></svg>
                           <span className="text-sm font-medium text-white">IKU 66</span>
                           <span className="text-sm text-gray-400 border-l border-gray-600 pl-2 ml-1">Kualitas Sedang</span>
                        </div>
                    </div>

                    {/* Wind Speed Card */}
                    {weather.windSpeed !== undefined && (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
                        <div className="z-10 relative">
                           <div className="text-sm text-gray-400 mb-1">Angin</div>
                           <div className="text-xl sm:text-2xl font-medium text-white">{weather.windSpeed} <span className="text-sm font-normal text-gray-300">km/j</span></div>
                        </div>
                        {/* Gauge Visualizer - Reduced size and properly anchored */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-60 translate-x-2 translate-y-2">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
                              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1e293b" strokeWidth="6"/>
                              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#38bdf8" strokeWidth="6" strokeDasharray="219.9" strokeDashoffset={219.9 - (219.9 * 30 / 100)} strokeLinecap="round"/>
                              <path d="M 50 15 L 50 25" stroke="white" strokeWidth="2" strokeLinecap="round" className="transform origin-[50px_50px] rotate-[120deg]"/>
                            </svg>
                        </div>
                      </div>
                    )}

                    {/* Humidity Card */}
                    {weather.humidity !== undefined && (
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-36">
                        <div className="z-10 relative">
                           <div className="text-sm text-gray-400 mb-1">Kelembapan</div>
                           <div className="text-2xl sm:text-3xl font-medium text-white">{weather.humidity}%</div>
                        </div>
                        {/* Gauge Visualizer - Reduced size and properly anchored */}
                        <div className="absolute bottom-0 right-0 w-24 h-24 opacity-60 translate-x-2 translate-y-2">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
                              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1e293b" strokeWidth="6"/>
                              <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="219.9" strokeDashoffset={219.9 - (219.9 * weather.humidity / 100)} strokeLinecap="round"/>
                               {/* Rain Drop in center of gauge */}
                               <path d="M50 25 C50 25, 40 40, 40 50 A10 10 0 0 0 60 50 C60 40, 50 25, 50 25 Z" fill="#3b82f6" className="transform origin-center rotate-45 scale-[0.35]" />
                            </svg>
                        </div>
                      </div>
                    )}
                 </div>
              </div>

              {/* Horizontal 7-Day Forecast */}
              {weather.daily && weather.daily.length > 0 && (
                <div className="px-5 pb-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl py-5 px-1 backdrop-blur-md">
                    <div className="flex overflow-x-auto custom-scrollbar gap-2 px-3 pl-3">
                      {weather.daily.map((day, index) => {
                        const dayInfo = getWeatherDesc(day.code);
                        const date = new Date(day.date);
                        let dayName = index === 0 ? 'Sekarang' : date.toLocaleDateString('id-ID', { weekday: 'short' });
                        if(index === 0) {
                           day.maxTemp = weather.temperature;
                        }

                        // Determine curve line point positioning
                        const isHigh = day.maxTemp > 28;

                        return (
                          <div key={day.date} className="flex flex-col items-center justify-between min-w-[64px] relative pb-2">
                            <div className="text-sm font-medium text-white mb-2">{day.maxTemp}°</div>
                            
                            {/* Temp Curve Simulation (CSS Line) */}
                            <div className="w-full h-8 relative mb-2">
                               <div className={`absolute left-0 right-0 h-[2px] bg-yellow-400 ${index !== 0 && index !== weather.daily!.length - 1 ? 'w-[120%] -left-1/4' : 'w-full'} ${isHigh ? 'top-2' : 'top-6'} transition-all`}></div>
                               <div className={`w-1.5 h-1.5 rounded-full bg-white absolute left-1/2 -translate-x-1/2 ${isHigh ? 'top-[7px]' : 'top-[23px]'} z-10 box-content border-2 border-[#1e293b]`}></div>
                            </div>
                            
                            <div className="text-2xl mb-2 drop-shadow-md">{dayInfo.icon}</div>
                            <div className="text-[11px] text-gray-400 font-medium">{dayName}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
               
              <div className="mt-auto pt-4 text-[10px] text-gray-500 text-center px-4 w-full opacity-60 flex justify-center items-center gap-1">
                 <span>Data disediakan oleh</span>
                 <span className="font-semibold text-gray-400">Open-Meteo</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Earthquake Detail Modal */}
      {showEarthquakeModal && earthquake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowEarthquakeModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                Info Gempa Terkini
              </h3>
              <button onClick={() => setShowEarthquakeModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Shakemap */}
            {earthquake.shakemap && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={`https://data.bmkg.go.id/DataMKG/TEWS/${earthquake.shakemap}`}
                  alt="Peta Guncangan Gempa"
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Magnitudo</div>
                <div className="text-3xl font-bold text-red-700 dark:text-red-300">{earthquake.magnitude}</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Kedalaman</div>
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{earthquake.depth}</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Waktu</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{earthquake.date}, {earthquake.time}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Lokasi</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{earthquake.location}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Koordinat: {earthquake.coordinates}</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="text-sm text-yellow-700 dark:text-yellow-400 font-medium mb-1">Potensi</div>
                <div className="text-base font-semibold text-yellow-900 dark:text-yellow-300">{earthquake.potential}</div>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
              Sumber: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
            </div>
          </div>
        </div>
      )}
    </>
  );
}
