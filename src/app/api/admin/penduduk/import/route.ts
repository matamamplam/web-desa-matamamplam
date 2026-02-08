import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { PendudukImportRow } from "@/lib/excel"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { data } = body as { data: PendudukImportRow[] }

    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "No data provided" },
        { status: 400 }
      )
    }

    // Process in transaction
    const result = await prisma.$transaction(async (tx) => {
      let insertedCount = 0
      const kkCache = new Map<string, any>()
      
      for (const row of data) {
        // 1. Find or Create KK (with caching)
        let kk = kkCache.get(row.noKK)

        if (!kk) {
          kk = await tx.kartuKeluarga.findUnique({
            where: { noKK: row.noKK },
          })

          if (!kk) {
            if (!row.kk_alamat) {
              // If creating new KK, address is required.
              throw new Error(`Data KK ${row.noKK} tidak ditemukan dan alamat tidak lengkap.`)
            }

            kk = await tx.kartuKeluarga.create({
              data: {
                noKK: row.noKK,
                kepalaKeluarga: row.nama, // Assuming this row is head
                alamat: row.kk_alamat, // Should be filled with Dusun name
                rt: row.kk_rt || "000",
                rw: row.kk_rw || "000",
                kelurahan: row.kk_kelurahan || "Mata Mamplam",
                kecamatan: row.kk_kecamatan || "Peusangan",
                kabupaten: row.kk_kabupaten || "Bireuen",
                provinsi: row.kk_provinsi || "Aceh",
                kodePos: row.kk_kodePos || "24261",
              },
            })
          }
          // Cache the found or created KK
          kkCache.set(row.noKK, kk)
        }

        // 2. Upsert Penduduk
        await tx.penduduk.upsert({
          where: { nik: row.nik },
          update: {
            nama: row.nama,
            tempatLahir: row.tempatLahir,
            tanggalLahir: new Date(row.tanggalLahir),
            jenisKelamin: row.jenisKelamin as any,
            agama: row.agama as any,
            pendidikan: row.pendidikan as any,
            pekerjaan: row.pekerjaan,
            statusPerkawinan: row.statusPerkawinan as any,
            hubunganDalamKeluarga: row.hubunganDalamKeluarga as any,
            golonganDarah: row.golonganDarah,
            kewarganegaraan: row.kewarganegaraan,
            namaAyah: row.namaAyah,
            namaIbu: row.namaIbu,
            kkId: kk.id,
          },
          create: {
            nik: row.nik,
            nama: row.nama,
            tempatLahir: row.tempatLahir,
            tanggalLahir: new Date(row.tanggalLahir),
            jenisKelamin: row.jenisKelamin as any,
            agama: row.agama as any,
            pendidikan: row.pendidikan as any,
            pekerjaan: row.pekerjaan,
            statusPerkawinan: row.statusPerkawinan as any,
            hubunganDalamKeluarga: row.hubunganDalamKeluarga as any,
            golonganDarah: row.golonganDarah,
            kewarganegaraan: row.kewarganegaraan,
            namaAyah: row.namaAyah,
            namaIbu: row.namaIbu,
            kkId: kk.id,
          },
        })
        insertedCount++
      }

      return { insertedCount }
    }, {
      maxWait: 10000, 
      timeout: 120000, // Increased to 120s
    })

    return NextResponse.json({
      message: "Import success",
      count: result.insertedCount,
    })
  } catch (error: any) {
    console.error("Import error:", error)
    return NextResponse.json(
      { message: "Import failed", error: error.message },
      { status: 500 }
    )
  }
}
