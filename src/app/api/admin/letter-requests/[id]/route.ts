import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - Get request detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        template: true,
        penduduk: {
          include: {
            kk: true,
          },
        },
        approver: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!letterRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(letterRequest)
  } catch (error: any) {
    console.error("Get request error:", error)
    return NextResponse.json(
      { message: "Failed to fetch request", error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update request status
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, notes } = body

    // Check if request exists
    const existing = await prisma.letterRequest.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: status || existing.status,
        notes: notes !== undefined ? notes : existing.notes,
        approvedAt: status === "APPROVED" || status === "COMPLETED" ? new Date() : existing.approvedAt,
        approverId: status === "APPROVED" || status === "REJECTED" ? session.user.id : existing.approverId,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Update request error:", error)
    return NextResponse.json(
      { message: "Failed to update request", error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete request
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

    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id },
    })

    if (!letterRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    // Restriction removed: User requested ability to delete completed requests as well.
    // if (letterRequest.status === "APPROVED" || letterRequest.status === "COMPLETED") { ... }

    await prisma.letterRequest.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Request deleted successfully" })
  } catch (error: any) {
    console.error("Delete request error:", error)
    return NextResponse.json(
      { message: "Failed to delete request", error: error.message },
      { status: 500 }
    )
  }
}
