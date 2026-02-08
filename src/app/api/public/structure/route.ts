import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 300; // Cache for 5 minutes

// GET /api/public/structure - Get organizational structure without phone numbers
export async function GET(req: NextRequest) {
  try {
    const positions = await prisma.villageOfficialPosition.findMany({
      include: {
        official: {
          select: {
            id: true,
            name: true,
            photo: true,
            email: true,
            address: true,
            startDate: true,
            endDate: true,
            isActive: true,
            // IMPORTANT: phone is NOT included
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    // Group positions by level for easier frontend rendering
    const structure = {
      level1: positions.filter((p) => p.level === 1),
      level2: positions.filter((p) => p.level === 2),
      level3: positions.filter((p) => p.level === 3),
      level4: positions.filter((p) => p.level === 4),
      level5: positions.filter((p) => p.level === 5),
      level6: positions.filter((p) => p.level === 6),
      all: positions,
    };

    return NextResponse.json({ structure });
  } catch (error) {
    console.error('Error fetching public structure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organizational structure' },
      { status: 500 }
    );
  }
}
