
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { processLetterContent, LetterData } from "@/lib/letter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, nik } = body

    if (!code || !nik) {
      return NextResponse.json(
        { message: "Kode verifikasi dan NIK wajib diisi" },
        { status: 400 }
      )
    }

    // 1. Find the letter request by verification code
    const letterRequest = await prisma.letterRequest.findUnique({
      where: { verificationCode: code },
      include: {
        template: true,
        penduduk: {
          include: {
            kk: true,
          },
        },
        approver: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!letterRequest) {
      return NextResponse.json(
        { message: "Surat tidak ditemukan" },
        { status: 404 }
      )
    }

    // 2. Verify NIK
    if (letterRequest.penduduk.nik !== nik) {
      return NextResponse.json(
        { message: "NIK tidak sesuai dengan data surat" },
        { status: 403 }
      )
    }

    // 3. Check status (optional, but usually only approved letters should be visible)
    if (letterRequest.status !== "APPROVED" && letterRequest.status !== "COMPLETED") {
       return NextResponse.json(
        { message: "Surat belum diterbitkan atau ditolak" },
        { status: 400 }
      )
    }

    // 4. Fetch additional data needed for rendering (Keuchik & Logo)
    const [keuchik, siteSettings] = await Promise.all([
      prisma.villageOfficial.findFirst({
        where: {
          position: {
            positionKey: "KEUCHIK"
          },
          isActive: true,
        },
      }),
      prisma.siteSettings.findFirst(),
    ])

    // Extract logo
    let logoUrl = "/images/logo/logo.svg"
    if (siteSettings?.settings) {
      const settings = siteSettings.settings as any
      if (settings.branding?.logo) {
        logoUrl = settings.branding.logo
      }
    }

    // 5. Generate Content
    const formData = (letterRequest.formData as Record<string, any>) || {}
    
    const letterData: LetterData = {
      nomorSurat: letterRequest.nomorSurat || "Draft",
      nama: letterRequest.penduduk.nama,
      nik: letterRequest.penduduk.nik,
      tempatLahir: letterRequest.penduduk.tempatLahir,
      tanggalLahir: letterRequest.penduduk.tanggalLahir,
      jenisKelamin: letterRequest.penduduk.jenisKelamin,
      agama: letterRequest.penduduk.agama,
      pekerjaan: letterRequest.penduduk.pekerjaan,
      alamat: letterRequest.penduduk.kk.alamat,
      rt: letterRequest.penduduk.kk.rt,
      rw: letterRequest.penduduk.kk.rw,
      purpose: letterRequest.purpose,
      tanggalSurat: letterRequest.updatedAt,
      namaPenandatangan: keuchik?.name || letterRequest.approver?.name || "Administrator",
      jabatanPenandatangan: "Keuchik",
      ...formData
    }

    const templateContent = letterRequest.template.template || ""
    const content = processLetterContent(templateContent, letterData)

    return NextResponse.json({
      success: true,
      data: {
        nomorSurat: letterRequest.nomorSurat,
        jenisSurat: letterRequest.template.name,
        tanggal: letterRequest.updatedAt,
        logoUrl,
        content,
      }
    })

  } catch (error: any) {
    console.error("Verification error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem", error: error.message },
      { status: 500 }
    )
  }
}
