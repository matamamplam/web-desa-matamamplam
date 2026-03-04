import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json", {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from BMKG: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error (Live Earthquake):", error);
    return NextResponse.json(
      { message: "Failed to fetch live earthquake data", error: error.message },
      { status: 500 }
    );
  }
}
