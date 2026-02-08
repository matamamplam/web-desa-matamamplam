import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import slugify from "slugify"

// GET - List news
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status && status !== "ALL") {
      where.status = status
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" }
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: { select: { name: true } },
          author: { select: { name: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.news.count({ where })
    ])

    return NextResponse.json({
      data: news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("News fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch news", error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create news
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, categoryId, status, thumbnail } = body

    // Generate slug
    let baseSlug = slugify(title, { lower: true, strict: true })
    let slug = baseSlug
    let counter = 1
    
    // Ensure uniqueness
    while (await prisma.news.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Default category if none provided (create General if needed, or handle error)
    // For now assuming categoryId is valid or we handle it. 
    // If categoryId is missing, we might need a default.

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnail,
        categoryId,
        status: status || "DRAFT",
        authorId: session.user.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null
      }
    })

    return NextResponse.json(news, { status: 201 })

  } catch (error: any) {
    console.error("News create error:", error)
    return NextResponse.json(
      { message: "Failed to create news", error: error.message },
      { status: 500 }
    )
  }
}
