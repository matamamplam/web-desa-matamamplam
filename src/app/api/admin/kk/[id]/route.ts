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

    const kk = await prisma.kartuKeluarga.findUnique({
      where: { id },
    })

    if (!kk) {
      return NextResponse.json({ message: "KK not found" }, { status: 404 })
    }

    return NextResponse.json(kk)
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

    // Check if KK exists
    const existing = await prisma.kartuKeluarga.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ message: "KK not found" }, { status: 404 })
    }

    // Update KK
    const kk = await prisma.kartuKeluarga.update({
      where: { id },
      data: {
        kepalaKeluarga: body.kepalaKeluarga,
        alamat: body.alamat,
        rt: body.rt,
        rw: body.rw,
        kodePos: body.kodePos,
        kelurahan: body.kelurahan,
        kecamatan: body.kecamatan,
        kabupaten: body.kabupaten,
        provinsi: body.provinsi,
        jenisRumah: body.jenisRumah,
      },
    })

    return NextResponse.json(kk)
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

    // Check if KK exists
    const existing = await prisma.kartuKeluarga.findUnique({
      where: { id },
      include: {
        _count: {
          select: { anggota: true },
        },
      },
    })

    if (!existing) {
      return NextResponse.json({ message: "KK not found" }, { status: 404 })
    }

    // Prevent deletion if has members
    if (existing._count.anggota > 0) {
      return NextResponse.json(
        { message: `Cannot delete KK with ${existing._count.anggota} member(s). Please remove all members first.` },
        { status: 400 }
      )
    }

    await prisma.kartuKeluarga.delete({
      where: { id },
    })

    return NextResponse.json({ message: "KK deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
