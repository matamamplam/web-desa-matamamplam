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
    if (eventId) {
      where.eventId = eventId
    }

    const posts = await prisma.commandPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: { title: true }
        },
        _count: {
            select: { refugees: true }
        }
      }
    })

    return NextResponse.json(posts)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch command posts", error: error.message },
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
      name, 
      location, 
      picName, 
      picPhone, 
      capacity, 
      latitude, 
      longitude, 
      locationLink,
      mapEmbedUrl,
      photo,
      facilities
    } = body

    const post = await prisma.commandPost.create({
      data: {
        eventId,
        name,
        location,
        picName,
        picPhone,
        capacity: parseInt(capacity || "0"),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        locationLink,
        mapEmbedUrl,
        photo,
        facilities
      }
    })

    return NextResponse.json(post, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create command post", error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { 
      id, name, location, picName, picPhone, capacity, 
      latitude, longitude, locationLink, mapEmbedUrl, photo, facilities 
    } = body

    const post = await prisma.commandPost.update({
      where: { id },
      data: {
        name,
        location,
        picName,
        picPhone,
        capacity: capacity ? parseInt(capacity) : undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        locationLink,
        mapEmbedUrl,
        photo,
        facilities
      }
    })

    return NextResponse.json(post)
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

    await prisma.commandPost.delete({ where: { id } })

    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}
