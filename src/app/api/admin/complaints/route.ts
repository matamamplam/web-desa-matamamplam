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
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status && status !== "ALL") {
      where.status = status
    }

    if (category && category !== "ALL") {
      where.categoryId = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          category: { select: { name: true } },
          penduduk: { select: { nama: true, nik: true } } // Show who complained if available
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.complaint.count({ where })
    ])

    return NextResponse.json({
      data: complaints,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch complaints", error: error.message },
      { status: 500 }
    )
  }
}
