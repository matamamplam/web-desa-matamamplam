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
    const umkm = await prisma.uMKM.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } }
      }
    })

    if (!umkm) {
      return NextResponse.json({ message: "UMKM not found" }, { status: 404 })
    }

    return NextResponse.json(umkm)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching UMKM", error: error.message },
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
      name, 
      description, 
      categoryId, 
      ownerName, 
      ownerPhone, 
      address, 
      mapsUrl,
      logo,
      isActive
    } = body

    // Slug update logic could be added here if needed, but usually slug stays or updates with name.
    // For now, let's keep slug stable or update if name changes.
    // Ideally, we check if name changed.
    
    // Simple implementation:
    let dataToUpdate: any = {
        name,
        description,
        categoryId,
        ownerName,
        ownerPhone,
        address,
        mapsUrl,
        logo,
        isActive
    };
    
    // If name changed, we might want to update slug, but it breaks URLs. Let's keep slug persistent for now unless explicitly requested.

    const updated = await prisma.uMKM.update({
      where: { id },
      data: dataToUpdate
    })

    return NextResponse.json(updated)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update UMKM", error: error.message },
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
    await prisma.uMKM.delete({ where: { id } })

    return NextResponse.json({ message: "UMKM deleted successfully" })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete UMKM", error: error.message },
      { status: 500 }
    )
  }
}
