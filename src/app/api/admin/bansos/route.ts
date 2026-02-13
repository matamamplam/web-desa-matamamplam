
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { BansosStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const bansosList = await prisma.bansos.findMany({
      include: {
        penerima: {
          select: {
            nama: true,
            nik: true,
          },
        },
        program: {
          select: {
            nama: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(bansosList)
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
    if (!body.pendudukId || !body.programId || !body.tahun) {
      return NextResponse.json(
        { message: "Penduduk, Program Bantuan, dan Tahun wajib diisi" },
        { status: 400 }
      )
    }

    // Check if resident already receives this aid type in the same year
    const existing = await prisma.bansos.findFirst({
      where: {
        pendudukId: body.pendudukId,
        programId: body.programId,
        tahun: parseInt(body.tahun),
        status: "AKTIF",
      },
    })

    if (existing) {
        return NextResponse.json(
            { message: "Penduduk ini sudah menerima bantuan jenis yang sama di tahun ini." },
            { status: 400 }
        )
    }

    const bansos = await prisma.bansos.create({
      data: {
        pendudukId: body.pendudukId,
        programId: body.programId,
        keterangan: body.keterangan,
        tahun: parseInt(body.tahun),
        status: (body.status as BansosStatus) || "AKTIF",
      },
    })

    return NextResponse.json(bansos, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
