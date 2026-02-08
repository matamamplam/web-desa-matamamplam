import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const BMKG_GEMPA_URL = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"

type BMKGData = {
  Infogempa: {
    gempa: {
      Tanggal: string
      Jam: string
      DateTime: string
      Coordinates: string
      Lintang: string
      Bujur: string
      Magnitude: string
      Kedalaman: string
      Wilayah: string
      Potensi: string
      Dirasakan: string
      Shakemap: string
    }
  }
}

export async function GET() {
  try {
    const response = await fetch(BMKG_GEMPA_URL, { cache: 'no-store' })
    if (!response.ok) {
        throw new Error("Failed to fetch data from BMKG")
    }

    const data: BMKGData = await response.json()
    const gempa = data.Infogempa.gempa

    // Create unique ID string from DateTime + Coordinates to avoid duplicates roughly
    // Or we can just use upsert if we had a unique ID from BMKG, but they don't provide one.
    // However, since we only want the LATEST gempa, we can just create a new record or update the latest one.
    // Strategy: We will just create a new record if it is different from the latest one in our DB.

    const latestGempaInDB = await prisma.earthquake.findFirst({
        orderBy: { datetime: 'desc' }
    })

    const newGempaDateIdx = new Date(gempa.DateTime).toISOString()

    if (!latestGempaInDB || latestGempaInDB.datetime.toISOString() !== newGempaDateIdx) {
        // New earthquake data
        await prisma.earthquake.create({
            data: {
                datetime: new Date(gempa.DateTime),
                date: gempa.Tanggal,
                time: gempa.Jam,
                coordinates: gempa.Coordinates,
                lintang: gempa.Lintang,
                bujur: gempa.Bujur,
                magnitude: gempa.Magnitude,
                depth: gempa.Kedalaman,
                location: gempa.Wilayah,
                potential: gempa.Potensi,
                shakemap: gempa.Shakemap
            }
        })
        return NextResponse.json({ message: "Earthquake data updated", data: gempa })
    }

    return NextResponse.json({ message: "No new earthquake data", data: gempa })

  } catch (error: any) {
    console.error("Error updating earthquake data:", error)
    return NextResponse.json({ message: "Error updating data", error: error.message }, { status: 500 })
  }
}
