import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { processLetterContent, LetterData } from "@/lib/letter"
import QRCode from "qrcode"
import PrintClient from "./ClientPrintButton"

export default async function PrintLetterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const request = await prisma.letterRequest.findUnique({
    where: { id },
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
          role: true, // Assuming role or jabatan is stored here or inferred
        },
      },
    },
  })

  if (!request) {
    notFound()
  }

  // Fetch additional data: Keuchik & Site Settings (Logo)
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

  // Extract logo from settings
  let logoUrl = "/images/logo/logo.svg" // Default fallback
  if (siteSettings?.settings) {
    const settings = siteSettings.settings as any
    if (settings.branding?.letterLogo) {
      logoUrl = settings.branding.letterLogo
    } else if (settings.branding?.logo) {
      logoUrl = settings.branding.logo
    }
  }

  // Prepare Data
  const formData = (request.formData as Record<string, any>) || {}
  
  const letterData: LetterData = {
    nomorSurat: request.nomorSurat || "Draft",
    nama: request.penduduk.nama,
    nik: request.penduduk.nik,
    tempatLahir: request.penduduk.tempatLahir,
    tanggalLahir: request.penduduk.tanggalLahir,
    jenisKelamin: request.penduduk.jenisKelamin,
    agama: request.penduduk.agama,
    pekerjaan: request.penduduk.pekerjaan,
    alamat: request.penduduk.kk.alamat,
    rt: request.penduduk.kk.rt,
    rw: request.penduduk.kk.rw,
    purpose: request.purpose,
    tanggalSurat: request.updatedAt,
    namaPenandatangan: keuchik?.name || request.approver?.name || "H. Ahmad Yani, S.Sos",
    jabatanPenandatangan: "Keuchik", // Fixed as requested
    ...formData // Merge dynamic form data
  }
  
  // Debug logs
  console.log("=== PRINT PAGE DEBUG ===")
  console.log("Template ID:", request.template.id)
  console.log("Letter Data:", JSON.stringify(letterData, null, 2))

  // Process Content
  const templateContent = request.template.template || ""
  const content = processLetterContent(templateContent, letterData)
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #print-area, #print-area * {
              visibility: visible;
            }
            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 2cm;
              background: white;
            }
            @page {
              size: A4;
              margin: 0;
            }
          }
        `
      }} />
      <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
        <PrintClient />
        
        {/* A4 Container */}
        <div id="print-area" className="mx-auto max-w-[210mm] min-h-[297mm] bg-white p-[2.54cm] shadow-lg print:shadow-none print:max-w-none print:min-h-0 font-serif">
          {/* Kop Surat (Header) */}
          <div className="mb-6 flex items-center border-b-[5px] border-double border-black pb-4">
             {/* Logo */}
             <div className="mr-4 flex h-24 w-24 flex-shrink-0 items-center justify-center pt-2">
                {/* Use absolute path for print compatibility, or Data URI in production */}
                <img 
                  src={logoUrl}
                  alt="Logo Kabupaten Bireuen" 
                  className="h-full w-full object-contain"
                />
             </div>
             
             {/* Text */}
             <div className="w-full text-center">
               <h3 className="text-xl font-bold uppercase leading-tight tracking-wider text-black">Pemerintah Kabupaten Bireuen</h3>
               <h3 className="text-xl font-bold uppercase leading-tight tracking-wider text-black">Kecamatan Peusangan</h3>
               <h2 className="text-2xl font-bold uppercase leading-tight tracking-widest text-black">Gampong Mata Mamplam</h2>
               <p className="mt-1 text-sm italic leading-tight text-black">Alamat: Jl. Cot Iju, Kode Pos 24261</p>
             </div>
          </div>

          {/* Content */}
          <div 
            className="prose max-w-none text-justify font-serif leading-relaxed text-black"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Footer removed as it is now part of the template */}
          {/* QR Code removed as requested */}
        </div>
      </div>
    </>
  )
}
