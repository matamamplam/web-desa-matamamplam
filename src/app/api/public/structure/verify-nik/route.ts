import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/public/structure/verify-nik - Verify NIK and return phone numbers
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nik } = body;

    if (!nik) {
      return NextResponse.json(
        { error: 'NIK is required' },
        { status: 400 }
      );
    }

    // Verify NIK exists in penduduk database
    const penduduk = await prisma.penduduk.findUnique({
      where: { nik },
      select: { nik: true, nama: true },
    });

    if (!penduduk) {
      return NextResponse.json(
        { error: 'NIK tidak terdaftar sebagai penduduk' },
        { status: 404 }
      );
    }

    // Log the verification attempt
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    await prisma.phoneViewLog.create({
      data: {
        nik,
        ipAddress,
        userAgent,
      },
    });

    // Fetch all officials with phone numbers
    const officials = await prisma.villageOfficial.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true, // Include phone numbers after verification
        positionId: true,
        position: {
          select: {
            positionName: true,
            dusunName: true,
          },
        },
      },
    });

    // Return phone numbers as a map: { officialId: phone }
    const phoneNumbers = officials.reduce((acc, official) => {
      acc[official.id] = official.phone;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({
      verified: true,
      verifiedName: penduduk.nama,
      phoneNumbers,
    });
  } catch (error) {
    console.error('Error verifying NIK:', error);
    return NextResponse.json(
      { error: 'Failed to verify NIK' },
      { status: 500 }
    );
  }
}
