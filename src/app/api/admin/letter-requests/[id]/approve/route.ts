import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// POST - Approve letter request and generate letter number
export async function POST(
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
    const { notes, pdfUrl } = body

    // Check if request exists
    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        template: true,
      },
    })

    if (!letterRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    if (letterRequest.status !== "PENDING" && letterRequest.status !== "PROCESSING") {
      return NextResponse.json(
        { message: "Only pending or processing requests can be approved" },
        { status: 400 }
      )
    }

    // Generate letter number
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()

    // Get the last letter number for this month
    const monthStart = new Date(year, now.getMonth(), 1)
    const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59)

    const lastLetter = await prisma.letterRequest.findFirst({
      where: {
        status: { in: ["APPROVED", "COMPLETED"] },
        approvedAt: {
          gte: monthStart,
          lte: monthEnd,
        },
        nomorSurat: { not: { startsWith: "TEMP-" } },
      },
      orderBy: { approvedAt: "desc" },
    })

    let sequence = 1
    if (lastLetter && lastLetter.nomorSurat) {
      // Extract sequence from format: 001/CODE/MM/YYYY
      const parts = lastLetter.nomorSurat.split("/")
      if (parts.length > 0) {
        const lastSeq = parseInt(parts[0])
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1
        }
      }
    }

    const letterNumber = `${String(sequence).padStart(3, "0")}/${letterRequest.template.code}/${month}/${year}`

    // Generate verification code (unique)
    const verificationCode = `${letterRequest.template.code}-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Update request
    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        status: "APPROVED",
        nomorSurat: letterNumber,
        approvedAt: new Date(),
        approverId: session.user.id,
        notes: notes || null,
        pdfUrl: pdfUrl || null,
        verificationCode,
      },
      include: {
        template: true,
        penduduk: {
          include: {
            kk: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      letterNumber,
      verificationCode,
      request: updated,
    })
  } catch (error: any) {
    console.error("Approve request error:", error)
    return NextResponse.json(
      { message: "Failed to approve request", error: error.message },
      { status: 500 }
    )
  }
}
