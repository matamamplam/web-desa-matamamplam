import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/structure/positions - Get all positions with officials
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const positions = await prisma.villageOfficialPosition.findMany({
      include: {
        official: true,
      },
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}

// POST /api/admin/structure/positions - Create new position (mainly for Kepala Dusun)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin permission
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true },
    });

    if (!user || !['SUPERADMIN', 'KEPALA_DESA'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { positionKey, positionName, dusunName } = body;

    if (!positionKey || !positionName) {
      return NextResponse.json(
        { error: 'Position key and name are required' },
        { status: 400 }
      );
    }

    // Create new Kepala Dusun position
    const position = await prisma.villageOfficialPosition.create({
      data: {
        category: 'DUSUN',
        positionKey,
        positionName: 'Kepala Dusun',
        level: 6,
        sortOrder: 99, // Will be at the end
        dusunName: dusunName || positionKey,
      },
    });

    return NextResponse.json({ position }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating position:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Position key already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    );
  }
}
