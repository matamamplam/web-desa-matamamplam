import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pendudukId, templateId, purpose, attachments, phoneNumber, formData } = body

    // Validation
    if (!pendudukId || !templateId || !purpose) {
      return NextResponse.json(
        { message: "Penduduk ID, template ID, and purpose are required" },
        { status: 400 }
      )
    }

    // Verify penduduk exists
    const penduduk = await prisma.penduduk.findUnique({
      where: { id: pendudukId },
    })

    if (!penduduk) {
      return NextResponse.json({ message: "Penduduk not found" }, { status: 404 })
    }

    // Generate temporary request number
    const tempNumber = `REQ-${Date.now()}`

    const newRequest = await prisma.letterRequest.create({
      data: {
        nomorSurat: tempNumber,
        templateId,
        pendudukId,
        purpose,
        phoneNumber: phoneNumber || null,
        formData: formData || {},
        attachments: attachments || null,
        status: "PENDING",
      },
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error: any) {
    console.error("Create public request error:", error)
    return NextResponse.json(
      { message: "Failed to create request", error: error.message },
      { status: 500 }
    )
  }
}
