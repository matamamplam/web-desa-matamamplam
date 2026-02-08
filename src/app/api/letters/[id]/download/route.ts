
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const letterRequest = await prisma.letterRequest.findUnique({
      where: { id },
      include: {
        penduduk: true,
      },
    });

    if (!letterRequest) {
      return NextResponse.json({ message: 'Letter not found' }, { status: 404 });
    }

    // Access control:
    // 1. Admins/Officials can download any letter
    // 2. Residents can only download their own letters (matched by NIK or user ID if linked)
    
    const userRole = session.user.role;
    const isOfficial = ['SUPERADMIN', 'KEPALA_DESA', 'SEKRETARIS', 'OPERATOR'].includes(userRole);
    
    // Check ownership if not official
    if (!isOfficial) {
      // Assuming session.user.email matches or we check NIK if available in session
      // For now, let's strictly check if the logged-in user's NIK matches the letter's penduduk NIK
      // OR if we stored userId in letterRequest. Currently schema links to Penduduk.
      
      // We need to fetch the logged-in user's NIK from DB to be sure
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { nik: true },
      });

      if (!user || user.nik !== letterRequest.penduduk.nik) {
         return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
    }

    // Ensure letter is approved/completed before download
    if (!['APPROVED', 'COMPLETED'].includes(letterRequest.status)) {
       return NextResponse.json({ message: 'Letter is not ready for download' }, { status: 400 });
    }

    if (!letterRequest.pdfUrl) {
        return NextResponse.json({ message: 'PDF not generated yet' }, { status: 404 });
    }

    // Redirect to the actual file URL (e.g. Cloudinary or secure storage)
    // Using 307 Temporary Redirect to keep method but here it's GET
    return NextResponse.redirect(letterRequest.pdfUrl);

  } catch (error: any) {
    console.error('Download error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
