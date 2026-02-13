import { NextResponse, NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { handleError } from "@/lib/error-handler"
import { successResponse } from "@/lib/api-response"
import { AuthError, ValidationError, ResourceConflictError, NotFoundError } from "@/lib/errors/exceptions"

// GET - List/Search penduduk
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      throw new AuthError()
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const all = searchParams.get("all") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const limitParam = searchParams.get("limit")
    const perPage = limitParam ? parseInt(limitParam) : 20
    const skip = all ? 0 : (page - 1) * perPage

    const where: any = {}

    if (search) {
      where.OR = [
        { nik: { contains: search, mode: "insensitive" } },
        { nama: { contains: search, mode: "insensitive" } },
      ]
    }

    // If fetching all data (for PDF), don't paginate
    if (all) {
      const penduduk = await prisma.penduduk.findMany({
        where,
        include: {
          kk: {
            select: {
              noKK: true,
              alamat: true,
              rt: true,
              rw: true,
              dusun: true 
            },
          },
        },
        orderBy: { nama: "asc" },
      })

      return successResponse ({ penduduk })
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
              dusun: true 
            },
          },
        },
        orderBy: { nama: "asc" },
        skip,
        take: perPage,
      }),
      prisma.penduduk.count({ where }),
    ])

    return successResponse({
      penduduk,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      throw new AuthError()
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      "kkId", "nik", "nama", "jenisKelamin", "tempatLahir", "tanggalLahir",
      "agama", "pendidikan", "pekerjaan", "statusPerkawinan", "hubunganDalamKeluarga"
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        throw new ValidationError({ field, message: `Field ${field} is required` })
      }
    }

    // Check if NIK already exists
    const existing = await prisma.penduduk.findUnique({
      where: { nik: body.nik },
    })

    if (existing) {
      throw new ResourceConflictError("NIK sudah terdaftar")
    }

    // Verify KK exists
    const kk = await prisma.kartuKeluarga.findUnique({
      where: { id: body.kkId },
    })

    if (!kk) {
      throw new NotFoundError({ resource: "Kartu Keluarga", id: body.kkId })
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

    return successResponse(penduduk, "Data penduduk berhasil ditambahkan", 201)
  } catch (error) {
    return handleError(error)
  }
}
