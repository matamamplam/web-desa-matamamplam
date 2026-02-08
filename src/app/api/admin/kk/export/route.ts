import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { generateExcel } from "@/lib/excel"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch all KK with member count
    const kkList = await prisma.kartuKeluarga.findMany({
      include: {
        _count: {
          select: { anggota: true },
        },
      },
      orderBy: { noKK: "asc" },
    })

    // Define columns for Excel
    const columns = [
      { header: "No. KK", key: "noKK", width: 18 },
      { header: "Kepala Keluarga", key: "kepalaKeluarga", width: 25 },
      { header: "Alamat", key: "alamat", width: 40 },
      { header: "RT", key: "rt", width: 8 },
      { header: "RW", key: "rw", width: 8 },
      { header: "Kelurahan/Desa", key: "kelurahan", width: 20 },
      { header: "Kecamatan", key: "kecamatan", width: 20 },
      { header: "Kabupaten/Kota", key: "kabupaten", width: 20 },
      { header: "Provinsi", key: "provinsi", width: 15 },
      { header: "Kode Pos", key: "kodePos", width: 10 },
      { header: "Jumlah Anggota", key: "jumlahAnggota", width: 15 },
    ]

    // Transform data for Excel
    const data = kkList.map((kk) => ({
      noKK: kk.noKK,
      kepalaKeluarga: kk.kepalaKeluarga,
      alamat: kk.alamat,
      rt: kk.rt,
      rw: kk.rw,
      kelurahan: kk.kelurahan,
      kecamatan: kk.kecamatan,
      kabupaten: kk.kabupaten,
      provinsi: kk.provinsi,
      kodePos: kk.kodePos || "",
      jumlahAnggota: kk._count.anggota,
    }))

    // Generate Excel file
    const buffer = generateExcel(data, columns, "kartu-keluarga")

    // Return file
    const filename = `kartu-keluarga-${new Date().toISOString().split("T")[0]}.xlsx`
    
    return new NextResponse(new Blob([new Uint8Array(buffer)]), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error("Export KK error:", error)
    return NextResponse.json(
      { message: "Failed to export data", error: error.message },
      { status: 500 }
    )
  }
}
