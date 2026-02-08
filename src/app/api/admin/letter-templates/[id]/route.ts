import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - Get template by ID
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

    const template = await prisma.letterTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { requests: true },
        },
      },
    })

    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(template)
  } catch (error: any) {
    console.error("Get template error:", error)
    return NextResponse.json(
      { message: "Failed to fetch template", error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update template
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
    const { name, description, template, isActive } = body

    // Check if template exists
    const existing = await prisma.letterTemplate.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 })
    }

    const updated = await prisma.letterTemplate.update({
      where: { id },
      data: {
        name: name || existing.name,
        description: description !== undefined ? description : existing.description,
        template: template || existing.template,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("Update template error:", error)
    return NextResponse.json(
      { message: "Failed to update template", error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete template
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

    // Check if template has requests
    const template = await prisma.letterTemplate.findUnique({
      where: { id },
      include: {
        _count: {
          select: { requests: true },
        },
      },
    })

    if (!template) {
      return NextResponse.json({ message: "Template not found" }, { status: 404 })
    }

    if (template._count.requests > 0) {
      return NextResponse.json(
        { message: `Cannot delete template with ${template._count.requests} existing requests. Set to inactive instead.` },
        { status: 400 }
      )
    }

    await prisma.letterTemplate.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Template deleted successfully" })
  } catch (error: any) {
    console.error("Delete template error:", error)
    return NextResponse.json(
      { message: "Failed to delete template", error: error.message },
      { status: 500 }
    )
  }
}
