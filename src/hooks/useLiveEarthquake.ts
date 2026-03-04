'use client';

import { useState, useEffect } from 'react';

// Coordinates for Kabupaten Bireuen: 5°06'31.1"N 96°39'49.7"E
const BIREUEN_LAT = 5 + 6/60 + 31.1/3600; // 5.10863889
const BIREUEN_LNG = 96 + 39/60 + 49.7/3600; // 96.66380556
const WARNING_RADIUS_KM = 250;

// Haversine formula to calculate distance between two lat/lng coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
}

export type EarthquakeData = {
  magnitude: string;
  location: string;
  date: string;
  time: string;
  depth: string;
  shakemap?: string;
  coordinates: string;
  lintang: string;
  bujur: string;
  potential: string;
  dirasakan?: string;
  distance: number | null;
  isWarning: boolean;
};

export function useLiveEarthquake(refreshIntervalMs = 60000) {
  const [earthquake, setEarthquake] = useState<EarthquakeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchEarthquake = async () => {
      try {
        const res = await fetch('/api/public/earthquake-live', {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        
        const gempa = data?.Infogempa?.gempa;
        if (gempa && isMounted) {
            
            // Parse coordinates "Lat,Lng"
            let quakeLat = 0;
            let quakeLng = 0;
            
            if (gempa.Coordinates) {
                const [latStr, lngStr] = gempa.Coordinates.split(',');
                quakeLat = parseFloat(latStr);
                quakeLng = parseFloat(lngStr);
            }

            const distance = calculateDistance(BIREUEN_LAT, BIREUEN_LNG, quakeLat, quakeLng);
            const magnitude = parseFloat(gempa.Magnitude);
            const isTsunamiPotential = gempa.Potensi && gempa.Potensi.toLowerCase().includes('tsunami') && !gempa.Potensi.toLowerCase().includes('tidak berpotensi');
            
            // Warning logic: within 250km AND (magnitude >= 5.0 OR TSUNAMI potential)
            // Or just any TSUNAMI potential within radius
            const isWarning = (distance <= WARNING_RADIUS_KM && magnitude >= 5.0) || (distance <= WARNING_RADIUS_KM && isTsunamiPotential);

            setEarthquake({
                magnitude: gempa.Magnitude,
                location: gempa.Wilayah,
                date: gempa.Tanggal,
                time: gempa.Jam,
                depth: gempa.Kedalaman,
                shakemap: gempa.Shakemap,
                coordinates: gempa.Coordinates,
                lintang: gempa.Lintang,
                bujur: gempa.Bujur,
                potential: gempa.Potensi,
                dirasakan: gempa.Dirasakan,
                distance: isNaN(distance) ? null : distance,
                isWarning: isWarning
            });
            setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
            setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEarthquake();
    const intervalId = setInterval(fetchEarthquake, refreshIntervalMs);

    return () => {
        isMounted = false;
        clearInterval(intervalId);
    };
  }, [refreshIntervalMs]);

  return { earthquake, loading, error };
}
