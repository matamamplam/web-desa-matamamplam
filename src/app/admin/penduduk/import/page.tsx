"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { parseExcelFile, ValidationResult } from "@/lib/excel"

export default function ImportPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewData, setPreviewData] = useState<ValidationResult[]>([])
  const [isValidating, setIsValidating] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setParsing(true)
    setPreviewData([])

    try {
      const buffer = await selectedFile.arrayBuffer()
      const results = parseExcelFile(buffer)
      setPreviewData(results)
    } catch (error: any) {
      toast.error("Gagal membaca file Excel: " + error.message)
    } finally {
      setParsing(false)
    }
  }

  const handleImport = async () => {
    const validRows = previewData.filter((r) => r.isValid)
    if (validRows.length === 0) {
      toast.error("Tidak ada data valid untuk diimport")
      return
    }

    const confirmed = confirm(`Akan mengimport ${validRows.length} data valid. Lanjutkan?`)
    if (!confirmed) return

    setUploading(true)
    const loadingToast = toast.loading("Sedang mengimport data...")

    try {
      const payload = {
        data: validRows.map((r) => r.data),
      }

      const response = await fetch("/api/admin/penduduk/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.message || "Gagal import data")
      }

      toast.success(`Berhasil mengimport ${result.count} data!`, { id: loadingToast })
      router.push("/admin/penduduk")
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast })
    } finally {
      setUploading(false)
    }
  }

  const validCount = previewData.filter((r) => r.isValid).length
  const invalidCount = previewData.filter((r) => !r.isValid).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/penduduk" className="hover:text-gray-900">Kependudukan</Link>
            <span>/</span>
            <span className="text-gray-900">Import Excel</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Import Data Penduduk</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload file Excel untuk import data penduduk secara massal
          </p>
        </div>
        <a
          href="/api/admin/penduduk/template"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Template
        </a>
      </div>

      {/* Upload Area */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex w-full items-center justify-center">
          <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg className="mb-3 h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Klik untuk upload</span> atau drag and drop
              </p>
              <p className="text-xs text-gray-500">XLSX, XLS (Max. 10MB)</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={parsing || uploading}
            />
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {previewData.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Baris</p>
                <p className="text-2xl font-bold text-gray-900">{previewData.length}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Valid</p>
                <p className="text-2xl font-bold text-green-600">{validCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Invalid</p>
                <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
              </div>
            </div>
            <button
              onClick={handleImport}
              disabled={validCount === 0 || uploading}
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Mengimport..." : "Import Data Valid"}
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Baris</th>
                    <th className="px-6 py-3">NIK</th>
                    <th className="px-6 py-3">Nama Lengkap</th>
                    <th className="px-6 py-3">L/P</th>
                    <th className="px-6 py-3">No KK</th>
                    <th className="px-6 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {previewData.map((row, index) => (
                    <tr key={index} className={row.isValid ? "bg-white" : "bg-red-50"}>
                      <td className="px-6 py-4">
                        {row.isValid ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">
                            Error
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{row.row}</td>
                      <td className="px-6 py-4 font-mono">{row.data?.nik}</td>
                      <td className="px-6 py-4">{row.data?.nama}</td>
                      <td className="px-6 py-4">{row.data?.jenisKelamin === "LAKI_LAKI" ? "L" : "P"}</td>
                      <td className="px-6 py-4 font-mono">{row.data?.noKK}</td>
                      <td className="px-6 py-4">
                        {!row.isValid && (
                          <ul className="list-disc pl-4 text-xs text-red-600 mb-2">
                            {row.errors.map((err, i) => (
                              <li key={i}>{err}</li>
                            ))}
                          </ul>
                        )}
                        {row.warnings && row.warnings.length > 0 && (
                          <ul className="list-disc pl-4 text-xs text-yellow-600">
                            {row.warnings.map((warn, i) => (
                              <li key={i}>{warn}</li>
                            ))}
                          </ul>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
