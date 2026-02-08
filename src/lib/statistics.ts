/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Get age group range from age
 */
export function getAgeGroup(age: number): string {
  if (age <= 5) return "0-5 tahun"
  if (age <= 12) return "6-12 tahun"
  if (age <= 17) return "13-17 tahun"
  if (age <= 25) return "18-25 tahun"
  if (age <= 40) return "26-40 tahun"
  if (age <= 60) return "41-60 tahun"
  return "60+ tahun"
}

/**
 * Format enum value to readable Indonesian text
 */
export function formatEnumValue(value: string): string {
  const mappings: Record<string, string> = {
    // Jenis Kelamin
    LAKI_LAKI: "Laki-laki",
    PEREMPUAN: "Perempuan",
    
    // Agama
    ISLAM: "Islam",
    KRISTEN: "Kristen",
    KATOLIK: "Katolik",
    HINDU: "Hindu",
    BUDDHA: "Buddha",
    KONGHUCU: "Konghucu",
    
    // Pendidikan
    TIDAK_SEKOLAH: "Tidak/Belum Sekolah",
    BELUM_TAMAT_SD: "Belum Tamat SD",
    SD: "SD/Sederajat",
    SMP: "SMP/Sederajat",
    SMA: "SMA/Sederajat",
    DIPLOMA_I: "Diploma I",
    DIPLOMA_II: "Diploma II",
    DIPLOMA_III: "Diploma III",
    DIPLOMA_IV_S1: "Diploma IV/S1",
    S2: "S2",
    S3: "S3",
    
    // Status Perkawinan
    BELUM_KAWIN: "Belum Kawin",
    KAWIN: "Kawin",
    CERAI_HIDUP: "Cerai Hidup",
    CERAI_MATI: "Cerai Mati",
  }
  
  return mappings[value] || value
}

/**
 * Aggregate data by field
 */
export function aggregateByField<T>(
  data: T[],
  field: keyof T,
  valueFormatter?: (value: any) => string
): Array<{ label: string; value: number }> {
  const counts = new Map<string, number>()
  
  data.forEach((item) => {
    const rawValue = item[field]
    const value = valueFormatter ? valueFormatter(rawValue) : String(rawValue)
    counts.set(value, (counts.get(value) || 0) + 1)
  })
  
  return Array.from(counts.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Get top N items from aggregated data
 */
export function getTopN<T extends { label: string; value: number }>(
  data: T[],
  n: number
): T[] {
  return data.slice(0, n)
}

/**
 * Group data by age ranges
 */
export function groupByAgeRanges(birthDates: (Date | string)[]): Array<{ range: string; count: number }> {
  const groups = new Map<string, number>()
  
  birthDates.forEach((birthDate) => {
    const age = calculateAge(birthDate)
    const range = getAgeGroup(age)
    groups.set(range, (groups.get(range) || 0) + 1)
  })
  
  // Sort by age range order
  const order = ["0-5 tahun", "6-12 tahun", "13-17 tahun", "18-25 tahun", "26-40 tahun", "41-60 tahun", "60+ tahun"]
  
  return order
    .filter((range) => groups.has(range))
    .map((range) => ({ range, count: groups.get(range)! }))
}

/**
 * Get month name in Indonesian
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  return months[monthIndex]
}

/**
 * Get last N months for trend charts
 */
export function getLastNMonths(n: number): string[] {
  const months: string[] = []
  const today = new Date()
  
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthName = getMonthName(date.getMonth())
    const year = date.getFullYear()
    months.push(`${monthName} ${year}`)
  }
  
  return months
}
