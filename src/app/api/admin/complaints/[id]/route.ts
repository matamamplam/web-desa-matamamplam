import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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
    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        penduduk: { select: { nama: true, nik: true, alamat: true } },
        responder: { select: { name: true } }
      }
    })

    if (!complaint) {
      return NextResponse.json({ message: "Complaint not found" }, { status: 404 })
    }

    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching complaint", error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { status, response } = body

    // Prepare update data
    const data: any = { status }
    
    // If response is provided, set responder and time
    if (response) {
      data.response = response
      data.respondedBy = session.user.id
      data.respondedAt = new Date()
      // Automatically set status to RESOLVED if responding and previous status was not RESOLVED/CLOSED?
      // Or let user control status explicitly. User flow: Update status manually.
      // If status is changed to RESOLVED/CLOSED, response usually required, but let's be flexible.
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data,
      include: {
        responder: { select: { name: true } }
      }
    })

    return NextResponse.json(updated)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update complaint", error: error.message },
      { status: 500 }
    )
  }
}

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
    await prisma.complaint.delete({ where: { id } })

    return NextResponse.json({ message: "Complaint deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete complaint", error: error.message },
      { status: 500 }
    )
  }
}
