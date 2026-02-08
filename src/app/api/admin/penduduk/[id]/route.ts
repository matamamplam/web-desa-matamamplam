import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const penduduk = await prisma.penduduk.findUnique({
      where: { id },
      include: {
        kk: true,
      },
    })

    if (!penduduk) {
      return NextResponse.json({ message: "Penduduk not found" }, { status: 404 })
    }

    return NextResponse.json(penduduk)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if penduduk exists
    const existing = await prisma.penduduk.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ message: "Penduduk not found" }, { status: 404 })
    }

    // Update penduduk
    const penduduk = await prisma.penduduk.update({
      where: { id },
      data: {
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

    return NextResponse.json(penduduk)
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Check if penduduk exists
    const existing = await prisma.penduduk.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ message: "Penduduk not found" }, { status: 404 })
    }

    await prisma.penduduk.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Penduduk deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
