import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// PATCH /api/admin/structure/officials/[id] - Update official
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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

    const { id } = params;
    const body = await req.json();
    const { name, phone, email, address, photo, startDate, endDate, isActive } = body;

    // Check if official exists
    const existingOfficial = await prisma.villageOfficial.findUnique({
      where: { id },
    });

    if (!existingOfficial) {
      return NextResponse.json(
        { error: 'Official not found' },
        { status: 404 }
      );
    }

    // Update official
    const official = await prisma.villageOfficial.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email: email || null }),
        ...(address !== undefined && { address: address || null }),
        ...(photo !== undefined && { photo: photo || null }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        position: true,
      },
    });

    return NextResponse.json({ official });
  } catch (error) {
    console.error('Error updating official:', error);
    return NextResponse.json(
      { error: 'Failed to update official' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/structure/officials/[id] - Remove official
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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

    const { id } = params;

    // Check if official exists
    const existingOfficial = await prisma.villageOfficial.findUnique({
      where: { id },
    });

    if (!existingOfficial) {
      return NextResponse.json(
        { error: 'Official not found' },
        { status: 404 }
      );
    }

    // Delete official
    await prisma.villageOfficial.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Official removed successfully' });
  } catch (error) {
    console.error('Error deleting official:', error);
    return NextResponse.json(
      { error: 'Failed to delete official' },
      { status: 500 }
    );
  }
}
