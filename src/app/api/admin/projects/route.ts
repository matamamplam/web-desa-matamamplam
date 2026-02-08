import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Helper to serialize BigInt
const replacer = (key: string, value: any) => {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return value
}

// GET - List projects
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

    // Explicitly select fields to avoid BigInt issues if we returned raw object, 
    // but Prisma returns BigInt object which needs handling.
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { startDate: "desc" },
        skip,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    // Use JSON.parse(JSON.stringify(obj, replacer)) pattern or manully map
    const serializedProjects = projects.map(p => ({
      ...p,
      budget: p.budget.toString()
    }))

    return NextResponse.json({
      data: serializedProjects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("Projects fetch error:", error)
    return NextResponse.json(
      { message: "Failed to fetch projects", error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      budget, 
      startDate, 
      endDate, 
      location, 
      status,
      photoBefore,
      photoAfter,
      photoGallery
    } = body

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget: BigInt(budget), // Convert string/number to BigInt
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        status: status || "PLANNING",
        progress: 0, // Default to 0
        photoBefore,
        photoAfter,
        photoGallery: photoGallery || [], // Ensure it's array
      }
    })

    return NextResponse.json({
      ...project,
      budget: project.budget.toString()
    }, { status: 201 })

  } catch (error: any) {
    console.error("Project create error:", error)
    return NextResponse.json(
      { message: "Failed to create project", error: error.message },
      { status: 500 }
    )
  }
}
