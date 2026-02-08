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
    const search = searchParams.get("search")
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.name = { contains: search, mode: "insensitive" }
    }

    const [umkm, total] = await Promise.all([
      prisma.uMKM.findMany({
        where,
        include: {
          category: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.uMKM.count({ where })
    ])

    return NextResponse.json({
      data: umkm,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch UMKM", error: error.message },
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
      name, 
      description, 
      categoryId, 
      ownerName, 
      ownerPhone, 
      address, 
      mapsUrl, // Google Maps Link
      logo,
      isActive 
    } = body

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();

    const newUmkm = await prisma.uMKM.create({
      data: {
        name,
        slug,
        description,
        categoryId,
        ownerName,
        ownerPhone,
        address,
        mapsUrl,
        logo,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(newUmkm, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create UMKM", error: error.message },
      { status: 500 }
    )
  }
}
