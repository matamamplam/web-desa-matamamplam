import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 600; // Cache for 10 minutes

// GET /api/public/umkm - Get active UMKM
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');

    const whereClause: any = {
      isActive: true,
    };

    if (category) {
      whereClause.category = category;
    }

    const umkm = await prisma.uMKM.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: {
          select: {
            name: true,
          },
        },
        logo: true,
        phone: true,
        address: true,
      },
    });

    return NextResponse.json({ umkm });
  } catch (error) {
    console.error('Error fetching public UMKM:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UMKM' },
      { status: 500 }
    );
  }
}
