import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const eventId = searchParams.get("eventId")
    const poskoId = searchParams.get("poskoId")
    const type = searchParams.get("type")
    const includeTransactions = searchParams.get("include_transactions") === "true"
    const id = searchParams.get("id")

    // Specific Item Fetch
    if (id) {
        const item = await prisma.logistics.findUnique({
            where: { id },
            include: {
                transactions: includeTransactions ? {
                    orderBy: { date: 'desc' },
                    take: 50
                } : false
            }
        })
        return NextResponse.json(item)
    }

    const where: any = {}
    
    // Filter by Posko or Event
    if (poskoId) {
        where.poskoId = poskoId
    } else if (eventId) {
        where.posko = { eventId }
    } else {
        return NextResponse.json({ message: "Event ID or Posko ID required" }, { status: 400 })
    }

    if (type) where.type = type

    const items = await prisma.logistics.findMany({
      where,
      orderBy: { itemName: "asc" },
      include: {
          posko: { select: { name: true } }
      }
    })

    return NextResponse.json(items)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to fetch logistics", error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { poskoId, itemName, unit, currentStock, type, description, notes } = body

    if (!poskoId || !itemName || !unit || !type) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const item = await prisma.logistics.create({
      data: {
        poskoId,
        itemName,
        unit,
        currentStock: Number(currentStock) || 0,
        type,
        description: description || notes, // Handle both just in case
        // photo: ... (TODO: Add photo support if needed)
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to create item", error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { id, itemName, unit, currentStock, type, description } = body

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    const updated = await prisma.logistics.update({
      where: { id },
      data: {
        itemName,
        unit,
        currentStock: currentStock !== undefined ? Number(currentStock) : undefined,
        type,
        description,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to update item", error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await auth()
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const body = await request.json()
        const { logisticsId, type, amount, description, date } = body

        if (!logisticsId || !type || !amount) {
             return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        // Transaction
        const transaction = await prisma.$transaction(async (tx) => {
            // 1. Create Transaction Record
            const newTx = await tx.logisticsTransaction.create({
                data: {
                    logisticsId,
                    type,
                    amount: Number(amount),
                    description,
                    date: date ? new Date(date) : new Date(),
                    reportedBy: session.user?.id // Assuming ID is available in session or fetch user
                }
            })

            // 2. Update Stock
            const increment = type === 'IN' ? Number(amount) : -Number(amount)
            await tx.logistics.update({
                where: { id: logisticsId },
                data: {
                    currentStock: { increment: increment }
                }
            })

            return newTx
        })

        return NextResponse.json(transaction)

    } catch (error: any) {
        return NextResponse.json({ message: "Transaction failed", error: error.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ message: "ID required" }, { status: 400 })

    await prisma.logistics.delete({ where: { id } })

    return NextResponse.json({ message: "Deleted" })
  } catch (error: any) {
    return NextResponse.json({ message: "Failed to delete item", error: error.message }, { status: 500 })
  }
}
