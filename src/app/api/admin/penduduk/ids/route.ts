import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const dusun = searchParams.get('dusun');

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { nik: { contains: search, mode: "insensitive" } },
        { nama: { contains: search, mode: "insensitive" } },
      ];
    }

    if (dusun) {
      where.kk = {
        OR: [
          // @ts-ignore
          { dusun: dusun },
          // Fallback for old data
          { alamat: { contains: dusun, mode: "insensitive" } }
        ]
      };
    }

    // Fetch all IDs matching the filter
    const penduduk = await prisma.penduduk.findMany({
      where,
      select: {
        id: true,
      },
    });

    const ids = penduduk.map(p => p.id);

    return NextResponse.json({ ids });
  } catch (error) {
    console.error('Error fetching IDs:', error);
    return NextResponse.json(
      { message: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}
