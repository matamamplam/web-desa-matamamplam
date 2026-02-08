import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600; // Cache for 1 hour

// GET /api/public/stats - Get village statistics
export async function GET() {
  try {
    // Get population statistics
    const [totalPenduduk, maleCount, femaleCount, totalKK, totalUMKM, totalProjects, ongoingProjects] = await Promise.all([
      prisma.penduduk.count(),
      prisma.penduduk.count({ where: { jenisKelamin: 'LAKI_LAKI' } }),
      prisma.penduduk.count({ where: { jenisKelamin: 'PEREMPUAN' } }),
      prisma.kartuKeluarga.count(),
      prisma.uMKM.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    const stats = {
      population: {
        total: totalPenduduk,
        male: maleCount,
        female: femaleCount,
        kk: totalKK,
      },
      umkm: {
        total: totalUMKM,
        active: totalUMKM,
      },
      projects: {
        total: totalProjects,
        ongoing: ongoingProjects,
        completed: totalProjects - ongoingProjects,
      },
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
