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
    const category = searchParams.get("category")
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12") // 12 grid items
    const skip = (page - 1) * limit

    const where: any = {}
    if (category && category !== "ALL") {
      where.categoryId = category
    }

    const [items, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        include: {
          category: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.galleryItem.count({ where })
    ])

    return NextResponse.json({
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch gallery", error: error.message },
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
    const { title, description, categoryId, mediaUrl, mediaType } = body

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        description,
        categoryId,
        mediaUrl,
        mediaType: mediaType || "IMAGE"
      }
    })

    return NextResponse.json(newItem, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create gallery item", error: error.message },
      { status: 500 }
    )
  }
}
