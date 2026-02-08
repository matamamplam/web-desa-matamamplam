import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - List all templates
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const where = activeOnly ? { isActive: true } : {}

    const templates = await prisma.letterTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(templates)
  } catch (error: any) {
    console.error("Get templates error:", error)
    return NextResponse.json(
      { message: "Failed to fetch templates", error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new template
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { code, name, description, template, isActive } = body

    // Validation
    if (!code || !name || !template) {
      return NextResponse.json(
        { message: "Code, name, and template are required" },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await prisma.letterTemplate.findUnique({
      where: { code },
    })

    if (existing) {
      return NextResponse.json(
        { message: `Template with code ${code} already exists` },
        { status: 400 }
      )
    }

    const newTemplate = await prisma.letterTemplate.create({
      data: {
        code,
        name,
        description: description || null,
        template,
        isActive: isActive !== undefined ? isActive : true,
      },
    })

    return NextResponse.json(newTemplate, { status: 201 })
  } catch (error: any) {
    console.error("Create template error:", error)
    return NextResponse.json(
      { message: "Failed to create template", error: error.message },
      { status: 500 }
    )
  }
}
