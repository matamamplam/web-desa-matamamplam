import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { AppError, DatabaseError, ValidationError, AuthError, NotFoundError } from './errors/exceptions';
import { ERROR_CODES, ERROR_MESSAGES } from './errors/repository';
import { errorResponse } from './api-response';

export async function handleError(error: unknown) {
  console.error('[ErrorHandler] Caught error:', error);

  // 1. Handle Known App Errors
  if (error instanceof AppError) {
    return errorResponse(error.code, error.details, error.statusCode);
  }

  // 2. Handle Zod Validation Errors
  if (error instanceof ZodError) {
    const details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
    return errorResponse(ERROR_CODES.VALIDATION_ERROR, details, 400);
  }

  // 3. Handle Prisma Database Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle specific Prisma error codes if needed
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
       const target = (error.meta?.target as string[]) || [];
       return errorResponse(ERROR_CODES.RESOURCE_ALREADY_EXISTS, { field: target.join(', ') }, 409);
    }
     // P2025: Record not found
    if (error.code === 'P2025') {
        return errorResponse(ERROR_CODES.RESOURCE_NOT_FOUND, null, 404);
    }
    
    // Log unexpected DB errors
    await logSystemError(error, 'DATABASE');
    return errorResponse(ERROR_CODES.DATABASE_ERROR, null, 500);
  }

  // 4. Handle Unexpected Errors
  // Log critical errors to DB
  await logSystemError(error, 'SYSTEM');
  
  return errorResponse(ERROR_CODES.INTERNAL_SERVER_ERROR, null, 500);
}

// Helper to persist logs
async function logSystemError(error: unknown, context: string) {
    try {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        
        await prisma.systemLog.create({
            data: {
                level: 'ERROR',
                message,
                stack,
                context: { type: context }
            }
        });
    } catch (loggingError) {
        // Fallback if DB logging fails
        console.error('Failed to log error to database:', loggingError);
    }
}
