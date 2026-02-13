
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const programs = await prisma.programBansos.findMany({
      orderBy: { nama: "asc" },
    })

    return NextResponse.json(programs)
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
    
    if (!body.nama) {
      return NextResponse.json(
        { message: "Nama program wajib diisi" },
        { status: 400 }
      )
    }

    const program = await prisma.programBansos.create({
      data: {
        nama: body.nama,
        keterangan: body.keterangan || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    })

    return NextResponse.json(program, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
        return NextResponse.json(
          { message: "Nama program sudah ada" },
          { status: 409 }
        )
    }
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
