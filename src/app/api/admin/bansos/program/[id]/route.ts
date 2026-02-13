
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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

    const program = await prisma.programBansos.update({
      where: { id },
      data: {
        nama: body.nama,
        keterangan: body.keterangan,
        isActive: body.isActive,
      },
    })

    return NextResponse.json(program)
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

    // Check usage
    const usageCount = await prisma.bansos.count({
        where: { programId: id }
    })

    if (usageCount > 0) {
        return NextResponse.json(
            { message: `Tidak dapat menghapus program ini karena sedang digunakan oleh ${usageCount} penerima.` },
            { status: 400 }
        )
    }

    await prisma.programBansos.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Program deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
