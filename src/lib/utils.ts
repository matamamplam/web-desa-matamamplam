import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatRupiah(amount: number | bigint): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string, formatStr: string = 'dd MMMM yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: idLocale })
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'dd MMMM yyyy HH:mm')
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Generate unique letter number
 * Format: XXX/DESA/MM/YYYY
 */
export function generateLetterNumber(prefix: string): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${random}/${prefix}/${month}/${year}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Create URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Parse BigInt for JSON serialization
 */
export function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  )
}
