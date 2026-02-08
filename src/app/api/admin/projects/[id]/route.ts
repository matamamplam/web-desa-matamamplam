import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

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
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...project,
      budget: project.budget.toString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching project", error: error.message },
      { status: 500 }
    )
  }
}

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
    const { 
      title, 
      description, 
      budget, 
      progress,
      startDate, 
      endDate, 
      location, 
      status,
      photoBefore,
      photoAfter,
      photoGallery
    } = body

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        budget: budget ? BigInt(budget) : undefined,
        progress: progress !== undefined ? parseInt(progress) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined, // Dates need to be parsed if string
        location,
        status,
        photoBefore,
        photoAfter,
        photoGallery
      }
    })

    return NextResponse.json({
      ...project,
      budget: project.budget.toString()
    })

  } catch (error: any) {
    console.error("Update project error:", error)
    return NextResponse.json(
      { message: "Failed to update project", error: error.message },
      { status: 500 }
    )
  }
}

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
    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete project", error: error.message },
      { status: 500 }
    )
  }
}
