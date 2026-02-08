import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get("eventId")

    const where: any = {}
    if (eventId) where.eventId = eventId

    const assessments = await prisma.damageAssessment.findMany({
      where,
      orderBy: { reportedAt: "desc" },
      include: {
        event: {
            select: { title: true }
        }
      }
    })

    return NextResponse.json(assessments)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch damage assessments", error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      eventId, 
      type, 
      title, 
      description, 
      location,
      dusun,
      severity,
      photo,
      status // Optional, default REPORTED
    } = body

    const assessment = await prisma.damageAssessment.create({
      data: {
        eventId,
        type,
        title,
        description,
        location,
        dusun,
        severity,
        photo,
        status: status || "REPORTED"
      }
    })

    return NextResponse.json(assessment, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create damage assessment", error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, type, title, description, location, dusun, severity, photo, status } = body

    const updated = await prisma.damageAssessment.update({
      where: { id },
      data: { type, title, description, location, dusun, severity, photo, status }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    await prisma.damageAssessment.delete({ where: { id } })

    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}
