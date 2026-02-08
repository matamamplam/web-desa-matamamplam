"use client"

import { useState, useEffect } from "react"

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/forecast?q=Bireuen,id&units=metric&appid=DEMO_KEY_WILL_FAIL_SO_USING_OPEN_METEO"
// Using Open-Meteo as it is free and requires no API key.
// Coordinates for Peusangan: 5.1667, 96.8333 (approx)
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast?latitude=5.1667&longitude=96.8333&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FBangkok"

type WeatherData = {
  current: {
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

// WMO Weather interpretation codes (WW)
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

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(OPEN_METEO_URL)
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch weather", err)
        setLoading(false)
      })
  }, [])

  if (loading || !weather) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    )
  }

  const currentInfo = getWeatherDesc(weather.current.weather_code)

  return (
    <div className="bg-gray-900/60 backdrop-blur-md rounded-xl shadow-lg text-white overflow-hidden relative border border-white/10">
       {/* Decorational Circles */}
       <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-xl"></div>
       <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-5 blur-xl"></div>

       <div className="p-6 relative z-10">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-white/90 font-medium text-sm">Cuaca Hari Ini</h3>
                <p className="text-white/80 text-xs mt-1">Kec. Peusangan</p>
             </div>
             <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long' })}
             </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
             <div className="flex items-center">
                 <span className="text-5xl mr-4 filter drop-shadow-md">{currentInfo.icon}</span>
                 <div>
                    <div className="text-4xl font-bold">{Math.round(weather.current.temperature_2m)}°C</div>
                    <p className="text-white/90 font-medium">{currentInfo.label}</p>
                 </div>
             </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
             <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                 <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                 </svg>
                 <div className="text-sm">
                    <span className="block text-white/70 text-xs">Kelembaban</span>
                    <span className="font-semibold">{weather.current.relative_humidity_2m}%</span>
                 </div>
             </div>
             <div className="flex items-center gap-2 bg-white/10 rounded-lg p-2">
                 <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <div className="text-sm">
                    <span className="block text-white/70 text-xs">Angin</span>
                    <span className="font-semibold">{weather.current.wind_speed_10m} km/h</span>
                 </div>
             </div>
          </div>
       </div>

       {/* Daily Forecast */}
       <div className="bg-white/10 backdrop-blur-md border-t border-white/10 p-4">
           <div className="flex justify-between text-center divide-x divide-white/10">
               {weather.daily.time.slice(1, 4).map((time, index) => {
                   const code = weather.daily.weather_code[index + 1]
                   const maxT = weather.daily.temperature_2m_max[index + 1]
                   const date = new Date(time).toLocaleDateString('id-ID', { weekday: 'short' })
                   const { icon } = getWeatherDesc(code)
                   
                   return (
                       <div key={time} className="px-2 flex-1">
                          <p className="text-xs text-white/80 mb-1">{date}</p>
                          <p className="text-xl mb-1">{icon}</p>
                          <p className="text-sm font-bold">{Math.round(maxT)}°</p>
                       </div>
                   )
               })}
           </div>
       </div>
    </div>
  )
}
