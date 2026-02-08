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

      {/* Weather Detail Modal */}
      {showWeatherModal && weather && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowWeatherModal(false)}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Prakiraan Cuaca {weather.city}</h3>
              <button onClick={() => setShowWeatherModal(false)} className="text-white/80 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Weather */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-8xl">{weather.icon}</div>
                  <div>
                    <div className="text-6xl font-bold text-white mb-2">{weather.temperature}°C</div>
                    <div className="text-2xl text-blue-100">{weather.condition}</div>
                    <div className="text-sm text-blue-200 mt-2">Hari ini</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-white">
                  {weather.humidity !== undefined && (
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">💧</div>
                      <div className="text-xs text-blue-200">Kelembaban</div>
                      <div className="font-bold">{weather.humidity}%</div>
                    </div>
                  )}
                  {weather.windSpeed !== undefined && (
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">💨</div>
                      <div className="text-xs text-blue-200">Angin</div>
                      <div className="font-bold">{weather.windSpeed} km/h</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            {weather.daily && weather.daily.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Prakiraan 7 Hari</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
                  {weather.daily.map((day, index) => {
                    const dayInfo = getWeatherDesc(day.code);
                    const date = new Date(day.date);
                    const dayName = index === 0 ? 'Hari Ini' : date.toLocaleDateString('id-ID', { weekday: 'short' });
                    const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

                    return (
                      <div key={day.date} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition-colors">
                        <div className="text-xs font-medium text-blue-100 mb-2">{dayName}</div>
                        <div className="text-xs text-blue-200 mb-3">{dateStr}</div>
                        <div className="text-4xl mb-3">{dayInfo.icon}</div>
                        <div className="text-xs text-blue-200 mb-2">{dayInfo.label}</div>
                        <div className="flex items-center justify-center gap-2 text-white">
                          <span className="font-bold">{day.maxTemp}°</span>
                          <span className="text-blue-300">/</span>
                          <span className="text-blue-200">{day.minTemp}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 text-xs text-blue-200 text-center">
              Sumber: Open-Meteo Weather API
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
