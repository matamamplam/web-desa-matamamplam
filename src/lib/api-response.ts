import { NextResponse } from 'next/server';
import { ERROR_MESSAGES, ErrorCode } from './errors/repository';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export function successResponse<T>(data: T, message: string = 'Success', statusCode: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  code: ErrorCode,
  details?: any,
  statusCode: number = 500,
  customMessage?: string
) {
  const message = customMessage || ERROR_MESSAGES[code] || 'An error occurred';
  
  return NextResponse.json(
    {
      success: false,
      message,
      error: {
        code,
        details,
      },
    },
    { status: statusCode }
  );
}
