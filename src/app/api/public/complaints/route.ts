import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      categoryId, 
      location, 
      nik, // Optional: for verification if needed later
      phone // Optional: for contact
    } = body

    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { message: "Mohon lengkapi data yang wajib diisi" },
        { status: 400 }
      )
    }

    // Optional: Find Penduduk if NIK provided
    let pendudukId = null
    if (nik) {
      const p = await prisma.penduduk.findUnique({ where: { nik } })
      if (p) pendudukId = p.id
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        categoryId,
        location,
        status: "SUBMITTED",
        pendudukId // Can be null (Anonymous/Guest)
      }
    })

    return NextResponse.json(complaint, { status: 201 })

  } catch (error: any) {
    console.error("Complaint submission error:", error)
    return NextResponse.json(
      { message: "Gagal mengirim pengaduan", error: error.message },
      { status: 500 }
    )
  }
}

// Get categories for the form
export async function GET(request: NextRequest) {
  try {
     const categories = await prisma.complaintCategory.findMany()
     return NextResponse.json(categories)
  } catch (error: any) {
     return NextResponse.json({ message: "Error", error: error.message }, { status: 500 })
  }
}
