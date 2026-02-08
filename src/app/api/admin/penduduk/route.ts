import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - List/Search penduduk
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const dusun = searchParams.get("dusun")
    const page = parseInt(searchParams.get("page") || "1")
    const limitParam = searchParams.get("limit")
    const perPage = limitParam ? parseInt(limitParam) : 20
    const skip = (page - 1) * perPage

    const where: any = {}

    if (search) {
      where.OR = [
        { nik: { contains: search, mode: "insensitive" } },
        { nama: { contains: search, mode: "insensitive" } },
      ]
    }

    const [penduduk, totalCount] = await Promise.all([
      prisma.penduduk.findMany({
        where,
        include: {
          kk: {
            select: {
              noKK: true,
              alamat: true,
              rt: true,
              rw: true,
              dusun: true // Ensure dusun is selected
            },
          },
        },
        orderBy: { nama: "asc" },
        skip,
        take: perPage,
      }),
      prisma.penduduk.count({ where }),
    ])

    return NextResponse.json({
      penduduk,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
    })
  } catch (error: any) {
    console.error("Get penduduk error:", error)
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
    const requiredFields = [
      "kkId", "nik", "nama", "jenisKelamin", "tempatLahir", "tanggalLahir",
      "agama", "pendidikan", "pekerjaan", "statusPerkawinan", "hubunganDalamKeluarga"
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { message: `Field ${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if NIK already exists
    const existing = await prisma.penduduk.findUnique({
      where: { nik: body.nik },
    })

    if (existing) {
      return NextResponse.json(
        { message: "NIK sudah terdaftar" },
        { status: 400 }
      )
    }

    // Verify KK exists
    const kk = await prisma.kartuKeluarga.findUnique({
      where: { id: body.kkId },
    })

    if (!kk) {
      return NextResponse.json(
        { message: "Kartu Keluarga tidak ditemukan" },
        { status: 404 }
      )
    }

    const penduduk = await prisma.penduduk.create({
      data: {
        kkId: body.kkId,
        nik: body.nik,
        nama: body.nama,
        jenisKelamin: body.jenisKelamin,
        tempatLahir: body.tempatLahir,
        tanggalLahir: new Date(body.tanggalLahir),
        agama: body.agama,
        pendidikan: body.pendidikan,
        pekerjaan: body.pekerjaan,
        statusPerkawinan: body.statusPerkawinan,
        hubunganDalamKeluarga: body.hubunganDalamKeluarga,
        namaIbu: body.namaIbu || null,
        namaAyah: body.namaAyah || null,
        golonganDarah: body.golonganDarah || null,
        kewarganegaraan: body.kewarganegaraan || "WNI",
        nomorPaspor: body.nomorPaspor || null,
        nomorKITAS: body.nomorKITAS || null,
      },
    })

    return NextResponse.json(penduduk, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
