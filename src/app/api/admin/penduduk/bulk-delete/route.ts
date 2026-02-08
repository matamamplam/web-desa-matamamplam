import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'IDs harus berupa array dan tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Delete all penduduk with the given IDs
    const result = await prisma.penduduk.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      message: `Berhasil menghapus ${result.count} data penduduk`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return NextResponse.json(
      { message: 'Gagal menghapus data penduduk' },
      { status: 500 }
    );
  }
}
