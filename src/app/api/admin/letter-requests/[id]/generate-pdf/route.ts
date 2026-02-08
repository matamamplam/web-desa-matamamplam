import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// POST - Mark request as completed (previously generate-pdf)
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

    // Get letter request
    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id },
    })

    if (!letterRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 })
    }

    if (letterRequest.status !== "APPROVED" && letterRequest.status !== "COMPLETED") {
      return NextResponse.json(
        { message: "Only approved requests can be marked as completed" },
        { status: 400 }
      )
    }

    // Generate QR code data for verification (just store the string, we render it on the fly)
    const qrData = `VERIFY:${letterRequest.verificationCode}`

    // Update status to COMPLETED
    // We don't save a static PDF URL anymore as we render on demand
    const updated = await prisma.letterRequest.update({
      where: { id },
      data: {
        qrCode: qrData,
        status: "COMPLETED",
        // pdfUrl: null // Optional: clear it or leave it
      },
    })

    return NextResponse.json({
      success: true,
      message: "Status updated to COMPLETED",
      request: updated,
    })
  } catch (error: any) {
    console.error("Update status error:", error)
    return NextResponse.json(
      { message: "Failed to update status", error: error.message },
      { status: 500 }
    )
  }
}
