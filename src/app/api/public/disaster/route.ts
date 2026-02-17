import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic' // Ensure no caching

export async function GET(request: NextRequest) {
  try {
    // 1. Find the most recent ACTIVE event
    const activeEvent = await prisma.disasterEvent.findFirst({
      where: {
        status: "ACTIVE"
      },
      include: {
        posts: {
          where: { isActive: true },
          include: {
            _count: {
              select: { refugees: true }
            },
            logistics: true
          }
        },
        damage: {
            orderBy: { reportedAt: 'desc' }
        },
        _count: {
          select: {
            affected: true,
            damage: true
          }
        }
      },
      orderBy: {
        startDate: "desc"
      }
    })

    // 2. Statistics (unchanged)
    let stats = [];
    if (activeEvent) {
        stats = await prisma.affectedResident.groupBy({
            by: ['condition'],
            where: { eventId: activeEvent.id },
            _count: { _all: true }
        }) as any;
    }

    // 3. Fetch & Update Earthquake Data (Real-time BMKG)
    try {
        const response = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json', { next: { revalidate: 60 } });
        if (response.ok) {
            const data = await response.json();
            const earthquakes = data?.Infogempa?.gempa || [];
            
            // Find latest quake in Aceh
            const acehQuake = earthquakes.find((q: any) => 
                (q.Wilayah && q.Wilayah.toLowerCase().includes('aceh')) || 
                (q.Dirasakan && q.Dirasakan.toLowerCase().includes('aceh'))
            );

            if (acehQuake) {
                // Parse BMKG DateTime (ISO format is provided in newer endpoints, or parse manual)
                // BMKG format: "2026-02-16T19:23:32+00:00" or similar. 
                // We'll use the DateTime field if available, otherwise construct from Tanggal/Jam if needed.
                const quakeDate = new Date(acehQuake.DateTime);

                // Upsert logic: Check if this specific quake exists (by time/date)
                const existing = await prisma.earthquake.findFirst({
                    where: {
                        datetime: quakeDate
                    }
                });

                if (!existing) {
                    await prisma.earthquake.create({
                        data: {
                            datetime: quakeDate,
                            date: acehQuake.Tanggal,
                            time: acehQuake.Jam,
                            coordinates: acehQuake.Coordinates,
                            lintang: acehQuake.Lintang,
                            bujur: acehQuake.Bujur,
                            magnitude: acehQuake.Magnitude,
                            depth: acehQuake.Kedalaman,
                            location: acehQuake.Wilayah,
                            potential: "Gempa Dirasakan", // Default for this endpoint
                            shakemap: "https://data.bmkg.go.id/DataMKG/TEWS/" + (acehQuake.Shakemap || "") // Note: Shakemap might need checking
                        }
                    });
                }
            }
        }
    } catch (e) {
        console.error("Failed to fetch BMKG data:", e);
        // Continue to serve existing DB data if fetch fails
    }

    // 4. Get Latest Earthquake from DB (Filter: Aceh)
    const earthquake = await prisma.earthquake.findFirst({
        where: {
            location: {
                contains: 'Aceh',
                mode: 'insensitive'
            }
        },
        orderBy: {
            datetime: 'desc'
        }
    });

    // Return combined data (Event can be null)
    return NextResponse.json({
        event: activeEvent,
        stats: stats,
        earthquake: earthquake
    })

  } catch (error: any) {
    console.error("API Error (Public Disaster):", error)
    return NextResponse.json(
      { message: "Failed to fetch public disaster data", error: error.message },
      { status: 500 }
    )
  }
}
