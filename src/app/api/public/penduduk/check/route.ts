import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const nik = searchParams.get("nik")

    if (!nik) {
      return NextResponse.json(
        { message: "NIK is required" },
        { status: 400 }
      )
    }

    const penduduk = await prisma.penduduk.findUnique({
      where: { nik },
      select: {
        id: true,
        nik: true,
        nama: true,
      },
    })

    if (!penduduk) {
      return NextResponse.json(
        { message: "NIK tidak ditemukan" },
        { status: 404 }
      )
    }

    return NextResponse.json({ penduduk })
  } catch (error: any) {
    console.error("Check NIK error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
