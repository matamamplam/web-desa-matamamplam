import * as XLSX from "xlsx"

export function generateExcel(data: any[], columns: any[], sheetName: string): Buffer {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
}

// Types for validation
export interface PendudukImportRow {
  nik: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  agama: string
  pendidikan: string
  pekerjaan: string
  statusPerkawinan: string
  hubunganDalamKeluarga: string
  golonganDarah?: string
  kewarganegaraan?: string
  namaAyah?: string
  namaIbu?: string
  noKK: string
  // KK Data (if creating new KK)
  kk_kepalaKeluarga?: string
  kk_alamat?: string
  kk_rt?: string
  kk_rw?: string
  kk_kodePos?: string
  kk_kelurahan?: string
  kk_kecamatan?: string
  kk_kabupaten?: string
  kk_provinsi?: string
}

export interface ValidationResult {
  row: number
  isValid: boolean
  errors: string[]
  warnings?: string[]
  data?: PendudukImportRow
}

// Validation helpers
export const isValidNIK = (nik: string) => /^\d{16}$/.test(nik)
export const isValidDate = (date: string) => !isNaN(Date.parse(date))

// Enum validations
export const ENUMS = {
  JENIS_KELAMIN: ["LAKI_LAKI", "PEREMPUAN"],
  AGAMA: ["ISLAM", "KRISTEN", "KATOLIK", "HINDU", "BUDDHA", "KONGHUCU"],
  PENDIDIKAN: ["TIDAK_SEKOLAH", "SD", "SMP", "SMA", "DIPLOMA", "S1", "S2", "S3"],
  STATUS_PERKAWINAN: ["BELUM_KAWIN", "KAWIN", "CERAI_HIDUP", "CERAI_MATI"],
  HUBUNGAN_KELUARGA: ["KEPALA_KELUARGA", "SUAMI", "ISTRI", "ANAK", "MENANTU", "CUCU", "ORANG_TUA", "MERTUA", "FAMILI_LAIN", "PEMBANTU", "LAINNYA"],
  GOLONGAN_DARAH: ["A", "B", "AB", "O", "TIDAK_TAHU"],
}

export function generateTemplate(): Buffer {
  // Create workbook
  const wb = XLSX.utils.book_new()

  // Sheet 1: Data Penduduk (Template)
  const headers = [
    "NO_KK", // Required
    "NIK", // Required
    "NAMA_LENGKAP", // Required
    "TEMPAT_LAHIR", // Required
    "TANGGAL_LAHIR (YYYY-MM-DD)", // Required
    "JENIS_KELAMIN", // Required
    "AGAMA", // Required
    "PENDIDIKAN", // Required
    "PEKERJAAN", // Required
    "STATUS_PERKAWINAN", // Required
    "HUBUNGAN_DALAM_KELUARGA", // Required
    "GOLONGAN_DARAH", // Optional
    "KEWARGANEGARAAN", // Optional
    "NAMA_AYAH", // Optional
    "NAMA_IBU", // Optional
    // KK Details (filled only for head of family or if new KK)
    "ALAMAT_KK (NAMA DUSUN)", // Optional - Mapped to Dusun
    "RT", // Optional - Default 000
    "RW", // Optional - Default 000
    "KODE_POS", // Optional - Default 24261
    "GAMPONG_KELURAHAN", // Optional - Default Mata Mamplam
    "KECAMATAN", // Optional - Default Peusangan
    "KABUPATEN_KOTA", // Optional - Default Bireuen
    "PROVINSI", // Optional - Default Aceh
  ]

  const sampleData = [
    [
      "1101234567890001", "1101234567890001", "Budi Santoso", "Banda Aceh", "1980-05-20", 
      "LAKI_LAKI", "ISLAM", "S1", "PNS", "KAWIN", "KEPALA_KELUARGA", 
      "O", "WNI",
      "Ayah Budi", "Ibu Budi", "Dusun Bale Situi", "000", "000", "24261", "Mata Mamplam", "Peusangan", "Bireuen", "Aceh"
    ],
    [
      "1101234567890001", "1101234567890002", "Siti Aminah", "Banda Aceh", "1985-08-15", 
      "PEREMPUAN", "ISLAM", "DIPLOMA", "Ibu Rumah Tangga", "KAWIN", "ISTRI", 
      "A", "WNI",
      "Ayah Siti", "Ibu Siti", "", "", "", "", "", "", "", ""
    ]
  ]

  const wsData = [headers, ...sampleData]
  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Validation Data Validation for specific columns
  // Note: Excel 2007+ Data Validation is not fully supported in sheetjs write operations for all versions
  // So we provide a reference sheet instead

  XLSX.utils.book_append_sheet(wb, ws, "Data Penduduk")

  // Sheet 2: Panduan Pengisian
  const guideHeaders = ["Kolom", "Keterangan", "Daftar Nilai Valid (Pilih Salah Satu)"]
  const guideData = [
    ["JENIS_KELAMIN", "Jenis Kelamin Penduduk", ENUMS.JENIS_KELAMIN.join(", ")],
    ["AGAMA", "Agama Penduduk", ENUMS.AGAMA.join(", ")],
    ["PENDIDIKAN", "Pendidikan Terakhir", ENUMS.PENDIDIKAN.join(", ")],
    ["STATUS_PERKAWINAN", "Status Perkawinan", ENUMS.STATUS_PERKAWINAN.join(", ")],
    ["HUBUNGAN_DALAM_KELUARGA", "Hubungan dalam KK", ENUMS.HUBUNGAN_KELUARGA.join(", ")],
    ["GOLONGAN_DARAH", "Golongan Darah", ENUMS.GOLONGAN_DARAH.join(", ")],
    ["KEWARGANEGARAAN", "Kewarganegaraan", "WNI, WNA"],
    ["TANGGAL_LAHIR", "Format Tanggal: YYYY-MM-DD", "Contoh: 1990-12-31"],
  ]

  const wsGuide = XLSX.utils.aoa_to_sheet([guideHeaders, ...guideData])
  XLSX.utils.book_append_sheet(wb, wsGuide, "Panduan & Referensi")

  // Generate buffer
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
}

export function parseExcelFile(buffer: ArrayBuffer | Buffer): ValidationResult[] {
  const wb = XLSX.read(buffer, { type: "array" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const jsonData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 })

  // Skip header row
  const rows = jsonData.slice(1)
  const results: ValidationResult[] = []

  rows.forEach((row, index) => {
    // Skip empty rows
    if (!row[0] && !row[1]) return

    const errors: string[] = []
    const data: PendudukImportRow = {
      noKK: String(row[0] || "").trim(),
      nik: String(row[1] || "").trim(),
      nama: String(row[2] || "").trim(),
      tempatLahir: String(row[3] || "").trim(),
      tanggalLahir: String(row[4] || "").trim(),
      jenisKelamin: String(row[5] || "").toUpperCase().trim(),
      agama: String(row[6] || "").toUpperCase().trim(),
      pendidikan: String(row[7] || "").toUpperCase().replace(/\s/g, "_").trim(),
      pekerjaan: String(row[8] || "").trim(),
      statusPerkawinan: String(row[9] || "").toUpperCase().replace(/\s/g, "_").trim(),
      hubunganDalamKeluarga: String(row[10] || "").toUpperCase().replace(/\s/g, "_").trim(),
      golonganDarah: String(row[11] || "").toUpperCase().trim(),
      kewarganegaraan: String(row[12] || "WNI").toUpperCase().trim(),
      namaAyah: String(row[13] || "").trim(),
      namaIbu: String(row[14] || "").trim(),
      kk_alamat: String(row[15] || "").trim(),
      kk_rt: String(row[16] || "000").trim(),
      kk_rw: String(row[17] || "000").trim(),
      kk_kodePos: String(row[18] || "24261").trim(),
      kk_kelurahan: String(row[19] || "Mata Mamplam").trim(),
      kk_kecamatan: String(row[20] || "Peusangan").trim(),
      kk_kabupaten: String(row[21] || "Bireuen").trim(),
      kk_provinsi: String(row[22] || "Aceh").trim(),
    }

    // Validation Logic
    if (!data.noKK) errors.push("No KK wajib diisi")
    if (!data.nik) errors.push("NIK wajib diisi")
    else if (!isValidNIK(data.nik)) errors.push("Format NIK tidak valid (harus 16 digit)")
    
    if (!data.nama) errors.push("Nama wajib diisi")
    
    if (!data.tanggalLahir) errors.push("Tanggal lahir wajib diisi")
    else if (!isValidDate(data.tanggalLahir)) errors.push("Format tanggal lahir tidak valid (YYYY-MM-DD)")

    if (!ENUMS.JENIS_KELAMIN.includes(data.jenisKelamin)) errors.push(`Jenis Kelamin tidak valid. Gunakan: ${ENUMS.JENIS_KELAMIN.join(", ")}`)
    if (!ENUMS.AGAMA.includes(data.agama)) errors.push(`Agama tidak valid. Gunakan: ${ENUMS.AGAMA.join(", ")}`)
    // Map simplified education input to Enum if possible, or validate strictly
    // For now strict validation matching the Enum
    // Note: User might input "SD" which is valid, but "SMA/Sederajat" might need mapping.
    // Let's rely on strict Enum matching for now based on the template guide.
    
    // Optional Validation for Golongan Darah
    if (data.golonganDarah && !ENUMS.GOLONGAN_DARAH.includes(data.golonganDarah)) {
       errors.push(`Golongan Darah tidak valid. Gunakan: ${ENUMS.GOLONGAN_DARAH.join(", ")}`)
    }

    if (data.kewarganegaraan && !["WNI", "WNA"].includes(data.kewarganegaraan)) {
      errors.push("Kewarganegaraan harus WNI atau WNA")
    }

    
    // Warning for missing address data (potential NEW KK issue)
    const warnings: string[] = []
    if (!data.kk_alamat) {
       warnings.push("Alamat KK kosong. Jika ini KK baru, import akan gagal.")
    }

    results.push({
      row: index + 2, // Excel row number (1-based, + header)
      isValid: errors.length === 0,
      errors,
      warnings,
      data
    })
  })

  return results
}
