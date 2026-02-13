export const ERROR_CODES = {
  // AUTH ERRORS
  AUTH_UNAUTHORIZED: 'AUTH_001',
  AUTH_FORBIDDEN: 'AUTH_002',
  AUTH_INVALID_CREDENTIALS: 'AUTH_003',
  AUTH_TOKEN_EXPIRED: 'AUTH_004',
  AUTH_ACCOUNT_LOCKED: 'AUTH_005',
  AUTH_ACCOUNT_INACTIVE: 'AUTH_006',

  // VALIDATION ERRORS
  VALIDATION_ERROR: 'VAL_001',
  MISSING_FIELDS: 'VAL_002',
  INVALID_FORMAT: 'VAL_003',

  // RESOURCE ERRORS
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_ALREADY_EXISTS: 'RES_002',
  RESOURCE_CONFLICT: 'RES_003',

  // SYSTEM ERRORS
  INTERNAL_SERVER_ERROR: 'SYS_001',
  DATABASE_ERROR: 'SYS_002',
  SERVICE_UNAVAILABLE: 'SYS_003',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.AUTH_UNAUTHORIZED]: 'Anda tidak memiliki akses untuk melakukan tindakan ini.',
  [ERROR_CODES.AUTH_FORBIDDEN]: 'Akses ditolak. Periksa izin akun Anda.',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Email atau kata sandi salah.',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Sesi Anda telah berakhir. Silakan login kembali.',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Akun Anda terkunci sementara karena terlalu banyak percobaan gagal.',
  [ERROR_CODES.AUTH_ACCOUNT_INACTIVE]: 'Akun Anda tidak aktif. Silakan hubungi administrator.',

  [ERROR_CODES.VALIDATION_ERROR]: 'Data yang dikirim tidak valid.',
  [ERROR_CODES.MISSING_FIELDS]: 'Harap lengkapi semua bidang yang wajib diisi.',
  [ERROR_CODES.INVALID_FORMAT]: 'Format data tidak sesuai.',

  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Data yang diminta tidak ditemukan.',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Data sudah ada dalam sistem.',
  [ERROR_CODES.RESOURCE_CONFLICT]: 'Terjadi konflik data (misal: data sudah ada).',

  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Terjadi kesalahan internal pada server.',
  [ERROR_CODES.DATABASE_ERROR]: 'Terjadi kesalahan pada database.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Layanan sedang tidak tersedia. Coba lagi nanti.',
};
