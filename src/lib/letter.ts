// Letter processing utility
import { format } from "date-fns"
import { id } from "date-fns/locale"

export interface LetterData {
  nomorSurat: string
  // Penduduk data
  nama: string
  nik: string
  tempatLahir: string
  tanggalLahir: Date
  jenisKelamin: string
  agama: string
  pekerjaan: string
  alamat: string
  rt?: string
  rw?: string
  // Request data
  purpose?: string
  tanggalSurat: Date
  // Approver data
  namaPenandatangan?: string
  jabatanPenandatangan?: string
  // Dynamic fields
  [key: string]: any
}

export function processLetterContent(content: string, data: LetterData): string {
  if (!content) return ""
  let processed = content

  // Base replacements
  const replacements: Record<string, string> = {
    "{{nomorSurat}}": data.nomorSurat || "...",
    "{{nama}}": data.nama,
    "{{nik}}": data.nik,
    "{{tempatLahir}}": data.tempatLahir,
    "{{tanggalLahir}}": format(new Date(data.tanggalLahir), "d MMMM yyyy", { locale: id }),
    "{{jenisKelamin}}": data.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan",
    "{{agama}}": data.agama,
    "{{pekerjaan}}": data.pekerjaan,
    "{{alamat}}": data.alamat,
    "{{rt}}": data.rt || "-",
    "{{rw}}": data.rw || "-",
    "{{tujuan}}": data.purpose || "-", 
    "{{tanggalSurat}}": format(new Date(data.tanggalSurat), "d MMMM yyyy", { locale: id }),
    "{{tahun}}": format(new Date(data.tanggalSurat), "yyyy", { locale: id }),
    "{{namaPenandatangan}}": data.namaPenandatangan || "Administrator",
    "{{jabatanPenandatangan}}": data.jabatanPenandatangan || "Keuchik",
  }

  // Merge dynamic data keys as potential replacements
  // This allows {{penghasilan}}, {{keperluan}}, etc. to be replaced if they exist in data
  Object.keys(data).forEach((key) => {
    const placeholder = `{{${key}}}`
    if (data[key] !== undefined && data[key] !== null) {
      // Use string formatting if strictly needed, or just toString()
      // Special handling for currency or numbers could be added here
      if (typeof data[key] === 'number') {
         replacements[placeholder] = data[key].toLocaleString('id-ID')
      } else if (data[key] instanceof Date) {
         replacements[placeholder] = format(data[key], "d MMMM yyyy", { locale: id })
      } else {
         replacements[placeholder] = String(data[key])
      }
    }
  })

  // Replace all occurrences
  Object.entries(replacements).forEach(([placeholder, value]) => {
    // Escape the curly braces for regex
    const regex = new RegExp(placeholder.replace(/\{/g, "\\{").replace(/\}/g, "\\}"), "g")
    processed = processed.replace(regex, value || "")
  })

  // Also support legacy [KEY] format just in case
  const legacyReplacements: Record<string, string> = {
    "[NOMOR_SURAT]": replacements["{{nomorSurat}}"],
    "[NAMA]": replacements["{{nama}}"],
    "[NIK]": replacements["{{nik}}"],
    "[TEMPAT_LAHIR]": replacements["{{tempatLahir}}"],
    "[TANGGAL_LAHIR]": replacements["{{tanggalLahir}}"],
    "[JENIS_KELAMIN]": replacements["{{jenisKelamin}}"],
    "[AGAMA]": replacements["{{agama}}"],
    "[PEKERJAAN]": replacements["{{pekerjaan}}"],
    "[ALAMAT]": replacements["{{alamat}}"],
    "[TANGGAL_SURAT]": replacements["{{tanggalSurat}}"],
    "[TAHUN]": replacements["{{tahun}}"],
    "[NAMA_PENANDATANGAN]": replacements["{{namaPenandatangan}}"],
    "[JABATAN_PENANDATANGAN]": replacements["{{jabatanPenandatangan}}"],
  }

   Object.entries(legacyReplacements).forEach(([placeholder, value]) => {
     processed = processed.split(placeholder).join(value || "")
   })

  return processed
}
