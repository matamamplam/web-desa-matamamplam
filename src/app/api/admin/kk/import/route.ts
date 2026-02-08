import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { parseExcel } from "@/lib/excel"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse Excel
    const rows = parseExcel(buffer)

    if (rows.length === 0) {
      return NextResponse.json({ message: "Excel file is empty" }, { status: 400 })
    }

    const errors: Array<{ row: number; message: string }> = []
    const successfulRecords: any[] = []

    // Validate and prepare data
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNumber = i + 2 // +2 because Excel starts at 1 and row 1 is header

      try {
        // Validate required fields
        if (!row["No. KK"] || !row["Kepala Keluarga"] || !row["Alamat"]) {
          errors.push({
            row: rowNumber,
            message: "Field wajib kosong: No. KK, Kepala Keluarga, atau Alamat",
          })
          continue
        }

        // Validate No KK format (16 digits)
        const noKK = row["No. KK"].toString().trim()
        if (!/^\d{16}$/.test(noKK)) {
          errors.push({
            row: rowNumber,
            message: "No. KK harus 16 digit angka",
          })
          continue
        }

        // Check if KK already exists
        const existing = await prisma.kartuKeluarga.findUnique({
          where: { noKK },
        })

        if (existing) {
          errors.push({
            row: rowNumber,
            message: `No. KK ${noKK} sudah terdaftar`,
          })
          continue
        }

        // Prepare record for insertion
        successfulRecords.push({
          noKK,
          kepalaKeluarga: row["Kepala Keluarga"].toString().trim(),
          alamat: row["Alamat"].toString().trim(),
          rt: row["RT"]?.toString().trim() || "000",
          rw: row["RW"]?.toString().trim() || "000",
          kelurahan: row["Kelurahan/Desa"]?.toString().trim() || "Mata Mamplam",
          kecamatan: row["Kecamatan"]?.toString().trim() || "",
          kabupaten: row["Kabupaten/Kota"]?.toString().trim() || "",
          provinsi: row["Provinsi"]?.toString().trim() || "",
          kodePos: row["Kode Pos"]?.toString().trim() || null,
        })
      } catch (err: any) {
        errors.push({
          row: rowNumber,
          message: err.message || "Error processing row",
        })
      }
    }

    // Insert successful records
    let insertedCount = 0
    if (successfulRecords.length > 0) {
      await prisma.kartuKeluarga.createMany({
        data: successfulRecords,
      })
      insertedCount = successfulRecords.length
    }

    return NextResponse.json({
      success: true,
      message: `Import selesai: ${insertedCount} data berhasil diimport`,
      imported: insertedCount,
      errors: errors.length > 0 ? errors : undefined,
      totalRows: rows.length,
    })
  } catch (error: any) {
    console.error("Import KK error:", error)
    return NextResponse.json(
      { message: "Failed to import data", error: error.message },
      { status: 500 }
    )
  }
}
