import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/structure/officials - Get all officials
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const officials = await prisma.villageOfficial.findMany({
      include: {
        position: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ officials });
  } catch (error) {
    console.error('Error fetching officials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch officials' },
      { status: 500 }
    );
  }
}

// POST /api/admin/structure/officials - Create/assign official to position
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
    const { positionId, name, phone, email, address, photo, startDate, endDate } = body;

    if (!positionId || !name || !phone) {
      return NextResponse.json(
        { error: 'Position ID, name, and phone are required' },
        { status: 400 }
      );
    }

    // Check if position exists
    const position = await prisma.villageOfficialPosition.findUnique({
      where: { id: positionId },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Position not found' },
        { status: 404 }
      );
    }

    // Check if position is already occupied
    const existingOfficial = await prisma.villageOfficial.findUnique({
      where: { positionId },
    });

    if (existingOfficial) {
      return NextResponse.json(
        { error: 'Position is already occupied' },
        { status: 409 }
      );
    }

    // Create official
    const official = await prisma.villageOfficial.create({
      data: {
        positionId,
        name,
        phone,
        email: email || null,
        address: address || null,
        photo: photo || null,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        position: true,
      },
    });

    return NextResponse.json({ official }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating official:', error);
    return NextResponse.json(
      { error: 'Failed to create official' },
      { status: 500 }
    );
  }
}
