import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import * as XLSX from "xlsx"
import { formatEnumValue } from "@/lib/statistics"

// Helper to format date
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]
}

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch all penduduk with KK
    const penduduk = await prisma.penduduk.findMany({
      include: {
        kk: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Fetch all KK separately for the KK sheet
    const kartuKeluarga = await prisma.kartuKeluarga.findMany({
      orderBy: {
        noKK: "asc",
      },
    })

    // Prepare Penduduk Data
    const pendudukData = penduduk.map((p) => ({
      "NIK": p.nik,
      "Nama Lengkap": p.nama,
      "No. KK": p.kk.noKK,
      "Jenis Kelamin": formatEnumValue(p.jenisKelamin),
      "Tempat Lahir": p.tempatLahir,
      "Tanggal Lahir": formatDate(p.tanggalLahir),
      "Agama": formatEnumValue(p.agama),
      "Pendidikan": formatEnumValue(p.pendidikan),
      "Pekerjaan": p.pekerjaan,
      "Status Perkawinan": formatEnumValue(p.statusPerkawinan),
      "Hubungan Dalam Keluarga": formatEnumValue(p.hubunganDalamKeluarga),
      "Kewarganegaraan": p.kewarganegaraan,
      "Nama Ayah": p.namaAyah || "-",
      "Nama Ibu": p.namaIbu || "-",
      "Alamat": p.kk.alamat,
      "RT": p.kk.rt,
      "RW": p.kk.rw,
    }))

    // Prepare KK Data
    const kkData = kartuKeluarga.map((k) => ({
      "No. KK": k.noKK,
      "Kepala Keluarga": k.kepalaKeluarga,
      "Alamat": k.alamat,
      "RT": k.rt,
      "RW": k.rw,
      "Kelurahan/Desa": k.kelurahan,
      "Kecamatan": k.kecamatan,
      "Kabupaten/Kota": k.kabupaten,
      "Provinsi": k.provinsi,
      "Kode Pos": k.kodePos || "-",
    }))

    // Create Workbook
    const wb = XLSX.utils.book_new()

    // Add Penduduk Sheet
    const wsPenduduk = XLSX.utils.json_to_sheet(pendudukData)
    // Set column widths
    const wscols = [
      { wch: 20 }, // NIK
      { wch: 30 }, // Nama
      { wch: 20 }, // No KK
      { wch: 15 }, // JK
      { wch: 20 }, // Tempat Lahir
      { wch: 15 }, // Tanggal Lahir
      // ... others auto
    ]
    wsPenduduk["!cols"] = wscols
    XLSX.utils.book_append_sheet(wb, wsPenduduk, "Data Penduduk")

    // Add KK Sheet
    const wsKK = XLSX.utils.json_to_sheet(kkData)
    const wsKKcols = [
      { wch: 20 }, // No KK
      { wch: 30 }, // Kepala Keluarga
      { wch: 40 }, // Alamat
      // ...
    ]
    wsKK["!cols"] = wsKKcols
    XLSX.utils.book_append_sheet(wb, wsKK, "Data Kartu Keluarga")

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data_penduduk_${formatDate(new Date())}.xlsx"`,
      },
    })
  } catch (error: any) {
    console.error("Export error:", error)
    return NextResponse.json(
      { message: "Failed to export data", error: error.message },
      { status: 500 }
    )
  }
}
