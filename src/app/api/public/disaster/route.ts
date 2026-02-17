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

    // 2. Get statistics for affected residents (only if event exists)
    let stats = [];
    if (activeEvent) {
        stats = await prisma.affectedResident.groupBy({
            by: ['condition'],
            where: {
                eventId: activeEvent.id
            },
            _count: {
                _all: true
            }
        }) as any;
    }

    // 3. Get Latest Earthquake (Filter: Aceh)
    const earthquake = await prisma.earthquake.findFirst({
        where: {
            location: {
                contains: 'Aceh',
                mode: 'insensitive'
            }
        },
        orderBy: {
            datetime: 'desc'
        }
    });

    // Return combined data (Event can be null)
    return NextResponse.json({
        event: activeEvent,
        stats: stats,
        earthquake: earthquake
    })

  } catch (error: any) {
    console.error("API Error (Public Disaster):", error)
    return NextResponse.json(
      { message: "Failed to fetch public disaster data", error: error.message },
      { status: 500 }
    )
  }
}
