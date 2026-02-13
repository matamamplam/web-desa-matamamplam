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

    // Validate manual letter number
    const { letterNumber } = body
    if (!letterNumber) {
      return NextResponse.json(
        { message: "Nomor surat wajib diisi" },
        { status: 400 }
      )
    }

    // Check availability
    const existing = await prisma.letterRequest.findFirst({
      where: {
        nomorSurat: letterNumber,
        id: { not: id } // Exclude current request
      }
    })

    if (existing) {
      return NextResponse.json(
        { message: "Nomor surat sudah digunakan" },
        { status: 400 }
      )
    }

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
