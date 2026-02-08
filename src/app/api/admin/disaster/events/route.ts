import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const events = await prisma.disasterEvent.findMany({
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: {
            affected: true,
            posts: true,
          }
        }
      }
    })

    return NextResponse.json(events)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch events", error: error.message },
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
    const { title, description, status, location } = body

    const event = await prisma.disasterEvent.create({
      data: {
        title,
        description,
        status: status || "ACTIVE",
        location,
        startDate: new Date(),
      }
    })

    return NextResponse.json(event, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create event", error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, status } = body

    const event = await prisma.disasterEvent.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json(event)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}
