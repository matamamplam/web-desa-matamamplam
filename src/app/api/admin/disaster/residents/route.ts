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
    const eventId = searchParams.get("eventId")
    const dusun = searchParams.get("dusun")

    const where: any = {}
    if (eventId) where.eventId = eventId
    
    // Filter by dusun requires checking the relation
    if (dusun) {
      where.penduduk = {
        kk: {
          dusun: dusun
        }
      }
    }

    const residents = await prisma.affectedResident.findMany({
      where,
      include: {
        penduduk: {
          include: {
            kk: true
          }
        },
        // @ts-ignore
        posko: true, // Include posko details
        event: {
            select: { title: true }
        }
      },
      orderBy: { lastUpdate: "desc" }
    })
    
    return NextResponse.json(residents)

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch affected residents", error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Check user to mark who reported
    const userEmail = session.user?.email
    let userId = null
    if (userEmail) {
        const user = await prisma.user.findUnique({ where: { email: userEmail } })
        userId = user?.id
    }

    // Handle Bulk Insert
    if (Array.isArray(body)) {
      const data = body.map((item: any) => ({
        eventId: item.eventId,
        pendudukId: item.pendudukId,
        condition: item.condition || "DISPLACED",
        currentLocation: item.currentLocation,
        poskoId: item.poskoId,
        specialNeeds: item.specialNeeds,
        notes: item.notes,
        reportedBy: userId
      }))

      const result = await prisma.affectedResident.createMany({
        data,
        skipDuplicates: true
      })
      
      return NextResponse.json({ count: result.count }, { status: 201 })
    }

    // Handle Single Insert (Manual or Linked)
    const { 
      eventId, 
      pendudukId, 
      manualName,
      manualAge,
      manualGender,
      manualAddress,
      condition,
      specialNeeds,
      currentLocation, 
      poskoId,
      notes 
    } = body

    const affected = await prisma.affectedResident.create({
      data: {
        eventId,
        pendudukId, // Can be null
        manualName,
        manualAge,
        manualGender,
        manualAddress,
        condition,
        specialNeeds,
        currentLocation,
        poskoId,
        notes,
        reportedBy: userId
      }
    })

    return NextResponse.json(affected, { status: 201 })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add affected resident", error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { 
        id, 
        condition, 
        notes, 
        currentLocation, 
        poskoId, 
        specialNeeds,
        manualName,
        manualAge,
        manualGender,
        manualAddress
    } = body

    const updated = await prisma.affectedResident.update({
      where: { id },
      data: { 
          condition, 
          notes, 
          currentLocation, 
          poskoId,
          specialNeeds,
          manualName,
          manualAge,
          manualGender,
          manualAddress,
          lastUpdate: new Date() 
      }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    await prisma.affectedResident.delete({ where: { id } })

    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed", error: error.message }, { status: 500 })
  }
}
