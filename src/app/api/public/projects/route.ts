import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 600; // Cache for 10 minutes

// GET /api/public/projects - Get development projects
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');
    const status = searchParams.get('status') as 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | null;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        startDate: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        budget: true,
        location: true,
        progress: true,
        startDate: true,
        endDate: true,
        photoBefore: true,
        photoAfter: true,
        photoGallery: true,
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
