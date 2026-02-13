
import { NextRequest } from 'next/server';
import { AppError, AuthError, NotFoundError, ValidationError } from '@/lib/errors/exceptions';
import { handleError } from '@/lib/error-handler';
import { ERROR_CODES } from '@/lib/errors/repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    switch (type) {
      case 'auth':
        throw new AuthError();
      case 'notfound':
        throw new NotFoundError({ resource: 'TestResource', id: '123' });
      case 'validation':
        throw new ValidationError({ field: 'email', message: 'Invalid email format' });
      case 'custom':
        throw new AppError(ERROR_CODES.SERVICE_UNAVAILABLE, 503);
      case 'system':
        throw new Error('This is a simulated critical system error');
      default:
        return new Response(JSON.stringify({ message: 'Select an error type: ?type=auth|notfound|validation|custom|system' }), { status: 200 });
    }
  } catch (error) {
    return handleError(error);
  }
}
