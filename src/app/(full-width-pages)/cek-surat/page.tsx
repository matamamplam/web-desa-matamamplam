
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchLetterPage() {
  const router = useRouter()
  const [code, setCode] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      router.push(`/cek-surat/${code.trim()}`)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Cek Validitas Surat
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan kode verifikasi yang tertera pada surat untuk mengecek keaslian dokumen.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSearch}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="code" className="sr-only">
                Kode Verifikasi
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-4 text-center text-lg placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Masukkan Kode Verifikasi (Contoh: SKTM-173...)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cek Surat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
