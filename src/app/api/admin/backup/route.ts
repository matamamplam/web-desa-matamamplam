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

    // Custom JSON serializer to handle Date and BigInt
    const jsonString = JSON.stringify(backup, (key, value) => {
      // Convert Date objects to ISO strings
      if (value instanceof Date) {
        return value.toISOString();
      }
      // Convert BigInt to string
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    }, 2);

    // Return JSON file as download
    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('❌ Backup error:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { 
        error: 'Failed to create backup',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
