import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.galleryItem.delete({ where: { id } })

    return NextResponse.json({ message: "Gallery item deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete gallery item", error: error.message },
      { status: 500 }
    )
  }
}
