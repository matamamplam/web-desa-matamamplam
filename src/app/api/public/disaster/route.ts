import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic' // Ensure no caching

export async function GET(request: NextRequest) {
  try {
    // 1. Find the most recent ACTIVE event
    const activeEvent = await prisma.disasterEvent.findFirst({
      where: {
        status: "ACTIVE"
      },
      include: {
        posts: {
          where: { isActive: true },
          include: {
            _count: {
              select: { refugees: true }
            },
            logistics: true
          }
        },
        damage: {
            orderBy: { reportedAt: 'desc' }
        },
        _count: {
          select: {
            affected: true,
            damage: true
          }
        }
      },
      orderBy: {
        startDate: "desc"
      }
    })

    // 2. Statistics (unchanged)
    let stats = [];
    if (activeEvent) {
        stats = await prisma.affectedResident.groupBy({
            by: ['condition'],
            where: { eventId: activeEvent.id },
            _count: { _all: true }
        }) as any;
    }

    // Return combined data (Event can be null)
    return NextResponse.json({
        event: activeEvent,
        stats: stats
    })

  } catch (error: any) {
    console.error("API Error (Public Disaster):", error)
    return NextResponse.json(
      { message: "Failed to fetch public disaster data", error: error.message },
      { status: 500 }
    )
  }
}
