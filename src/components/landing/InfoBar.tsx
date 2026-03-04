'use client';

import { useState } from 'react';
import { useLiveEarthquake } from '@/hooks/useLiveEarthquake';

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

export default function InfoBar({ weather }: InfoBarProps) {
  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [showEarthquakeModal, setShowEarthquakeModal] = useState(false);
  const { earthquake, loading } = useLiveEarthquake();

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
            {loading ? (
              <div className="animate-pulse flex items-center gap-3 px-4 py-2">
                <div className="h-4 w-24 bg-white/20 rounded"></div>
              </div>
            ) : earthquake && (
              <button
                onClick={() => setShowEarthquakeModal(true)}
                className={`flex items-center gap-3 text-white px-4 py-2 rounded-lg transition-all group ${
                  earthquake.isWarning ? 'bg-red-600/80 hover:bg-red-600 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' : 'hover:bg-white/10'
                }`}
              >
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-sm">M{earthquake.magnitude} Gempa Terkini</div>
                  <div className={`text-xs truncate max-w-[200px] ${earthquake.isWarning ? 'text-white font-medium tracking-wide' : 'text-red-200'}`}>
                    {earthquake.isWarning ? '⚠️ WARNING! GEMPA DEKAT' : earthquake.location}
                  </div>
                </div>
                <div className="relative">
                  <span className="text-2xl">{earthquake.isWarning ? '🚨' : '🌍'}</span>
                  {!earthquake.isWarning && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                </div>
                <svg className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${earthquake.isWarning ? 'text-white' : 'text-red-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Weather Detail Modal (HyperOS Inspired - Robust Layout) */}
      {showWeatherModal && weather && (
        <div 
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-6 transition-opacity"
          onClick={() => setShowWeatherModal(false)}
        >
          {/* Main Modal Container */}
          <div 
            className="w-full sm:max-w-md h-[92vh] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl bg-[#0b1320] text-white flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0b0f19] opacity-90 pointer-events-none"></div>
            
            {/* Header (Sticky inside flex column) */}
            <div className="relative flex items-center justify-between px-6 py-5 bg-[#0f172a]/80 backdrop-blur-md z-20 shrink-0 border-b border-white/5">
              <h3 className="text-xl sm:text-2xl font-medium tracking-wide">{weather.city}</h3>
              <div className="flex items-center gap-4">
                <button className="text-white/50 cursor-default" aria-hidden="true" disabled>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
                <button onClick={() => setShowWeatherModal(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Tutup">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="relative flex-1 overflow-y-auto w-full custom-scrollbar pb-8 pt-4">
              
              {/* Temperature Display */}
              <div className="flex flex-col items-center justify-center mb-8">
                 <div className="text-[100px] leading-[0.85] font-light tracking-tighter">
                    {weather.temperature}°
                 </div>
                 <div className="text-lg text-slate-300 font-medium mt-4">
                    {weather.condition}
                 </div>
              </div>

              <div className="px-5 sm:px-6 space-y-4">
                  {/* AQI Pill - Static Non-Interactive */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md cursor-default">
                      <div className="flex items-center gap-3">
                         <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor"><path d="M17 19.22H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2.22h-2V19.22zM21 4.5l-3.5 3.5l-1.41-1.41L18.17 4.5L16.08 2.41L17.5 1h7l-3.5 3.5z"/></svg>
                         <span className="text-sm font-semibold text-white">IKU 66</span>
                         <span className="text-sm font-medium text-slate-300 border-l border-slate-600 pl-3">Kualitas Sedang</span>
                      </div>
                  </div>

                  {/* Bento Grid layout */}
                  <div className="grid grid-cols-2 gap-4">
                      {/* Wind Card */}
                      {weather.windSpeed !== undefined && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 relative overflow-hidden h-36 flex flex-col justify-between backdrop-blur-md">
                          <div className="relative z-10 w-full">
                            <div className="text-sm text-slate-400 font-medium mb-1">Angin</div>
                            <div className="text-2xl font-semibold text-white">{weather.windSpeed} <span className="text-xs font-normal text-slate-400">km/j</span></div>
                          </div>
                          {/* Securely Anchored SVG Gauge */}
                          <div className="absolute -bottom-4 -right-1 w-24 h-24 opacity-60 pointer-events-none">
                              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="8"/>
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#38bdf8" strokeWidth="8" strokeDasharray="239" strokeDashoffset={239 - (239 * 30 / 100)} strokeLinecap="round"/>
                                <path d="M 50 12 L 50 25" stroke="white" strokeWidth="3" strokeLinecap="round" className="transform origin-[50px_50px] rotate-[130deg]"/>
                              </svg>
                          </div>
                        </div>
                      )}

                      {/* Humidity Card */}
                      {weather.humidity !== undefined && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 relative overflow-hidden h-36 flex flex-col justify-between backdrop-blur-md">
                          <div className="relative z-10 w-full">
                            <div className="text-sm text-slate-400 font-medium mb-1">Kelembapan</div>
                            <div className="text-2xl font-semibold text-white">{weather.humidity}%</div>
                          </div>
                          {/* Securely Anchored SVG Gauge */}
                          <div className="absolute -bottom-4 -right-1 w-24 h-24 opacity-60 pointer-events-none">
                              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-45">
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="8"/>
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="239" strokeDashoffset={239 - (239 * weather.humidity / 100)} strokeLinecap="round"/>
                                <path d="M50 25 C50 25, 40 40, 40 50 A10 10 0 0 0 60 50 C60 40, 50 25, 50 25 Z" fill="#3b82f6" className="transform origin-center rotate-45 scale-[0.4]" />
                              </svg>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Horizontal 7-Day Forecast */}
                  {weather.daily && weather.daily.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl pt-5 pb-3 overflow-hidden backdrop-blur-md">
                       <div className="w-full overflow-x-auto custom-scrollbar px-4 pb-2">
                          <div className="flex gap-2 min-w-max items-end">
                            {weather.daily.map((day, index) => {
                              const dayInfo = getWeatherDesc(day.code);
                              const date = new Date(day.date);
                              const dayName = index === 0 ? 'Sekarang' : date.toLocaleDateString('id-ID', { weekday: 'short' });
                              if(index === 0) day.maxTemp = weather.temperature;
                              const isHigh = day.maxTemp > 28;

                              return (
                                <div key={day.date} className="flex flex-col items-center justify-end w-[64px] relative">
                                  <span className="text-sm font-semibold text-white z-10">{day.maxTemp}°</span>
                                  
                                  {/* Curve line simulation using simple robust CSS */}
                                  <div className="h-8 w-full relative flex items-center justify-center pointer-events-none overflow-visible my-1 px-3">
                                    {index !== weather.daily!.length - 1 && (
                                      <div className={`absolute top-1/2 left-1/2 w-full h-[2px] bg-yellow-400 rotate-0 origin-left`}></div>
                                    )}
                                    <div className={`w-1.5 h-1.5 rounded-full bg-white z-10 border-2 border-[#1e293b] box-content ${isHigh ? 'mb-4' : 'mt-4'}`}></div>
                                  </div>

                                  <span className="text-2xl mt-1 mb-2 drop-shadow-md">{dayInfo.icon}</span>
                                  <span className="text-[11px] font-medium text-slate-400">{dayName}</span>
                                </div>
                              );
                            })}
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="text-center pt-2 pb-2 text-[10px] text-slate-500 font-medium">
                    Data disediakan oleh <span className="font-semibold text-slate-400 whitespace-nowrap">Open-Meteo</span>
                  </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Earthquake Detail Modal */}
      {showEarthquakeModal && earthquake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowEarthquakeModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between mb-6 border-b pb-4 ${earthquake.isWarning ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'}`}>
              <h3 className={`text-2xl font-bold flex items-center gap-2 ${earthquake.isWarning ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                <span className="text-3xl">{earthquake.isWarning ? '🚨' : '🌍'}</span>
                {earthquake.isWarning ? 'Peringatan Gempa!' : 'Info Gempa Terkini'}
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
              <div className={`${earthquake.isWarning ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'} rounded-xl p-4 border`}>
                <div className={`text-sm font-medium mb-1 ${earthquake.isWarning ? 'text-red-700 dark:text-red-400' : 'text-yellow-700 dark:text-yellow-400'}`}>Potensi</div>
                <div className={`text-base font-semibold ${earthquake.isWarning ? 'text-red-900 dark:text-red-300' : 'text-yellow-900 dark:text-yellow-300'}`}>{earthquake.potential}</div>
              </div>
              
              {earthquake.distance !== null && (
                 <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 mt-4">
                    <div className="text-sm text-blue-700 dark:text-blue-400 font-medium mb-1">Jarak Lokasi Gempa</div>
                    <div className="text-base font-semibold text-blue-900 dark:text-blue-300">
                      ~{Math.round(earthquake.distance)} KM dari Bireuen
                    </div>
                 </div>
              )}
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
