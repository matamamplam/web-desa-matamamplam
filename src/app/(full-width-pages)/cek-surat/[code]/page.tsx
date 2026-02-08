
"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function VerifyLetterPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const router = useRouter()
  
  const [nik, setNik] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [letterData, setLetterData] = useState<any>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nik || nik.length < 16) {
      toast.error("NIK harus 16 digit")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/public/verify-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, nik }),
      })

      const data = await res.json()

      if (res.ok) {
        setLetterData(data.data)
        setIsVerified(true)
        toast.success("Verifikasi berhasil!")
      } else {
        toast.error(data.message || "Verifikasi gagal")
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isVerified && letterData) {
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
              padding: 2.5cm; /* Standard margin for print */
              background: white;
            }
            @page {
              size: auto;
              margin: 0;
            }
            /* Hide non-print elements */
            .no-print {
                display: none !important;
            }
          }
        `
      }} />

      <div className="min-h-screen bg-gray-100 p-8 print:bg-white print:p-0">
        <div className="no-print mx-auto mb-6 max-w-[210mm] flex items-center justify-between">
            <button
                onClick={() => router.push('/cek-surat')}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                &larr; Cek Surat Lain
            </button>
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Cetak Surat
            </button>
        </div>

        {/* Paper Container */}
        <div id="print-area" className="mx-auto max-w-[210mm] min-h-[297mm] bg-white p-[2.54cm] shadow-lg print:shadow-none print:max-w-none print:min-h-0 font-serif">
           {/* Kop Surat (Header) */}
          <div className="mb-6 flex items-center border-b-[5px] border-double border-black pb-4">
             {/* Logo */}
             <div className="mr-4 flex h-24 w-24 flex-shrink-0 items-center justify-center pt-2">
                <img 
                  src={letterData.logoUrl}
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

          <div 
            className="prose max-w-none text-justify font-serif leading-relaxed text-black"
            dangerouslySetInnerHTML={{ __html: letterData.content }}
          />
        </div>
      </div>
      </>
    )
  }

  // Verification Form
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Verifikasi Identitas
          </h2>
          <p className="mt-2 text-sm text-gray-600">
             Dokumen ditemukan dengan kode: <span className="font-mono font-bold text-indigo-600">{code}</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Silakan masukkan NIK Pemilik Surat untuk membuka dokumen ini.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="nik" className="sr-only">
                NIK Pemilik Surat
              </label>
              <input
                id="nik"
                name="nik"
                type="text"
                required
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-4 text-center text-lg placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Masukkan 16 Digit NIK"
                maxLength={16}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
                Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex-1 justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Buka Surat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
