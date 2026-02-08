import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import slugify from "slugify"

// GET - Get Detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { name: true, email: true } }
      }
    })

    if (!news) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(news)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching article", error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update
export async function PUT(
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
    const { title, excerpt, content, categoryId, status, thumbnail } = body

    const existing = await prisma.news.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ message: "Article not found" }, { status: 404 })
    }

    // Update slug if title changed (optional, usually better to keep slug stable or make it explicit)
    // Here we'll only update slug if explicitly asked or just keep it simple.
    // Let's re-generate slug if title changes significantly? Or just leave it.
    // Better practice for SEO: Don't change slug unless necessary. Let's keep it unless title changed dramatically?
    // User expectation: Title update -> Slug update usually.
    
    let slug = existing.slug
    if (title && title !== existing.title) {
       let baseSlug = slugify(title, { lower: true, strict: true })
       slug = baseSlug
       let counter = 1
       while (await prisma.news.findUnique({ where: { slug, NOT: { id } } })) {
         slug = `${baseSlug}-${counter}`
         counter++
       }
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: title || existing.title,
        slug,
        excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
        content: content || existing.content,
        categoryId: categoryId || existing.categoryId,
        thumbnail: thumbnail !== undefined ? thumbnail : existing.thumbnail,
        status: status || existing.status,
        publishedAt: status === "PUBLISHED" && existing.status !== "PUBLISHED" ? new Date() : existing.publishedAt,
      }
    })

    return NextResponse.json(updated)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update article", error: error.message },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.news.delete({ where: { id } })

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete article", error: error.message },
      { status: 500 }
    )
  }
}
