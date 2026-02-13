import { ERROR_CODES, ERROR_MESSAGES, ErrorCode } from './repository';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(code: ErrorCode, statusCode: number = 500, details?: any) {
    super(ERROR_MESSAGES[code] || 'An unexpected error occurred');
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(details?: any) {
    super(ERROR_CODES.VALIDATION_ERROR, 400, details);
  }
}

export class AuthError extends AppError {
  constructor(code: ErrorCode = ERROR_CODES.AUTH_UNAUTHORIZED, statusCode: number = 401) {
    super(code, statusCode);
  }
}

export class NotFoundError extends AppError {
  constructor(details?: any) {
    super(ERROR_CODES.RESOURCE_NOT_FOUND, 404, details);
  }
}

export class DatabaseError extends AppError {
  constructor(details?: any) {
    super(ERROR_CODES.DATABASE_ERROR, 500, details);
  }
}

export class ResourceConflictError extends AppError {
  constructor(message: string) {
    super(ERROR_CODES.RESOURCE_CONFLICT, 409, { message });
  }
}
