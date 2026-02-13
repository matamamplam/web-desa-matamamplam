import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const all = searchParams.get("all") === "true"

    const where: any = {}
    if (search) {
      where.OR = [
        { noKK: { contains: search, mode: "insensitive" } },
        { kepalaKeluarga: { contains: search, mode: "insensitive" } },
      ]
    }

    // If fetching all data (for PDF), include all fields and count
    if (all) {
      const kk = await prisma.kartuKeluarga.findMany({
        where,
        include: {
          _count: {
            select: {
              anggota: true
            }
          }
        },
        orderBy: { kepalaKeluarga: "asc" },
      })
      return NextResponse.json({ kk })
    }

    const kkList = await prisma.kartuKeluarga.findMany({
      where,
      select: {
        id: true,
        noKK: true,
        kepalaKeluarga: true,
        rt: true,
        rw: true,
      },
      orderBy: { kepalaKeluarga: "asc" },
      take: 100,
    })

    return NextResponse.json(kkList)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ["noKK", "kepalaKeluarga", "alamat", "rt", "rw", "kodePos", "kelurahan", "kecamatan", "kabupaten", "provinsi"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Field ${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if noKK already exists
    const existing = await prisma.kartuKeluarga.findUnique({
      where: { noKK: body.noKK },
    })

    if (existing) {
      return NextResponse.json(
        { message: "No. KK sudah terdaftar" },
        { status: 400 }
      )
    }

    const kk = await prisma.kartuKeluarga.create({
      data: {
        noKK: body.noKK,
        kepalaKeluarga: body.kepalaKeluarga,
        alamat: body.alamat,
        rt: body.rt,
        rw: body.rw,
        kodePos: body.kodePos,
        kelurahan: body.kelurahan,
        kecamatan: body.kecamatan,
        kabupaten: body.kabupaten,
        provinsi: body.provinsi,
        // @ts-ignore
        dusun: body.dusun || body.alamat, // Use alamat as fallback
        jenisRumah: body.jenisRumah,
      },
    })

    return NextResponse.json(kk, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
