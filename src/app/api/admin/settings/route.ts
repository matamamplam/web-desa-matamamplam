import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/admin/settings - Get current settings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/settings - Update settings
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update settings
    // Only SUPERADMIN and KEPALA_DESA can update settings
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
    const { settings: updatedSettings } = body;

    if (!updatedSettings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Find existing settings
    const existingSettings = await prisma.siteSettings.findFirst();

    let result;
    if (existingSettings) {
      // Update existing settings
      result = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: { settings: updatedSettings },
      });
    } else {
      // Create new settings if none exist
      result = await prisma.siteSettings.create({
        data: { settings: updatedSettings },
      });
    }

    return NextResponse.json({
      message: 'Settings updated successfully',
      settings: result,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
