import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

// GET - List all letter requests with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const templateId = searchParams.get("templateId")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = 20
    const skip = (page - 1) * perPage

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (templateId) {
      where.templateId = templateId
    }

    if (search) {
      where.OR = [
        { nomorSurat: { contains: search, mode: "insensitive" } },
        {
          penduduk: {
            OR: [
              { nama: { contains: search, mode: "insensitive" } },
              { nik: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ]
    }

    const [requests, totalCount] = await Promise.all([
      prisma.letterRequest.findMany({
        where,
        include: {
          template: {
            select: {
              code: true,
              name: true,
            },
          },
          penduduk: {
            select: {
              nik: true,
              nama: true,
              kk: {
                select: {
                  alamat: true,
                  rt: true,
                  rw: true,
                },
              },
            },
          },
          approver: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: perPage,
      }),
      prisma.letterRequest.count({ where }),
    ])

    return NextResponse.json({
      requests,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
    })
  } catch (error: any) {
    console.error("Get requests error:", error)
    return NextResponse.json(
      { message: "Failed to fetch requests", error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new letter request (from public form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pendudukId, templateId, purpose, attachments, phoneNumber, formData } = body

    // Validation
    if (!pendudukId || !templateId || !purpose) {
      return NextResponse.json(
        { message: "Penduduk ID, template ID, and purpose are required" },
        { status: 400 }
      )
    }

    // ... (rest of validation)

    // Generate temporary request number (will be replaced on approval)
    const tempNumber = `TEMP-${Date.now()}`

    const newRequest = await prisma.letterRequest.create({
      data: {
        nomorSurat: tempNumber,
        templateId,
        pendudukId,
        purpose,
        phoneNumber: phoneNumber || null,
        formData: formData || {},
        attachments: attachments || null,
        status: "PENDING",
      },
      include: {
        template: true,
        penduduk: true,
      },
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error: any) {
    console.error("Create request error:", error)
    return NextResponse.json(
      { message: "Failed to create request", error: error.message },
      { status: 500 }
    )
  }
}
