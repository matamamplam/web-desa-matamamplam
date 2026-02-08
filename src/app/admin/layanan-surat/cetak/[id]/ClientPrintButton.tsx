"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ClientPrintButton() {
  // Auto-trigger print when opened? Maybe annoying. Let's provide a floating button.

  return (
    <div className="fixed right-8 top-8 flex flex-col gap-4 print:hidden">
      <button
        onClick={() => window.print()}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
        title="Cetak Surat"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
      
      <Link
         href="/admin/layanan-surat/permohonan" // Or back to dashboard
         className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white shadow-lg hover:bg-gray-700 transition-transform hover:scale-105"
         title="Kembali"
      >
         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
         </svg>
      </Link>
    </div>
  )
}
