import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session || session.user.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📦 Starting database backup...');

    // Get all model names from Prisma
    const modelNames = Object.keys(prisma).filter(
      (key) => !key.startsWith('_') && !key.startsWith('$')
    );

    const backup: any = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        generatedBy: session.user.email,
      },
    };

    // Backup each model
    for (const modelName of modelNames) {
      try {
        const model = (prisma as any)[modelName];
        if (model && typeof model.findMany === 'function') {
          const records = await model.findMany();
          backup[modelName] = records;
          console.log(`✓ ${modelName}: ${records.length} records`);
        }
      } catch (error) {
        console.error(`✗ Failed to backup ${modelName}:`, error);
        backup[modelName] = [];
      }
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `backup_${timestamp}.json`;

    // Return JSON file as download
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('❌ Backup error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}
