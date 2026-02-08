"use client"

import { useState } from "react"
import Link from "next/link"

interface ExcelActionsProps {
  type: "kk" | "penduduk"
}

export default function ExcelActions({ type }: ExcelActionsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importMessage, setImportMessage] = useState<{
    type: "success" | "error"
    text: string
    details?: any
  } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/admin/${type}/export`)
      
      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition")
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
      const filename = filenameMatch ? filenameMatch[1] : `${type}-export.xlsx`

      // Download file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setImportMessage({
        type: "success",
        text: "✅ Export berhasil! File sudah didownload.",
      })
      
      setTimeout(() => setImportMessage(null), 3000)
    } catch (error: any) {
      setImportMessage({
        type: "error",
        text: `❌ Export gagal: ${error.message}`,
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`/api/admin/${type}/import`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to import data")
      }

      // Show success message with details
      const message = result.message
      const hasErrors = result.errors && result.errors.length > 0
      
      setImportMessage({
        type: hasErrors ? "error" : "success",
        text: message,
        details: hasErrors ? result.errors : null,
      })

      // Refresh page if successful and no errors
      if (!hasErrors) {
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error: any) {
      setImportMessage({
        type: "error",
        text: `❌ Import gagal: ${error.message}`,
      })
    } finally {
      setIsImporting(false)
      // Reset input
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-3">
        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="inline-flex items-center rounded-lg border border-green-600 bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Excel
            </>
          )}
        </button>

        {/* Import Button */}
        <Link
          href="/admin/penduduk/import"
          className="inline-flex items-center rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Import Excel
        </Link>
      </div>

      {/* Message Display */}
      {importMessage && (
        <div
          className={`rounded-lg border p-4 ${
            importMessage.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <p className="text-sm font-medium">{importMessage.text}</p>
          
          {/* Error Details */}
          {importMessage.details && importMessage.details.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-semibold mb-2">Detail Error:</p>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {importMessage.details.slice(0, 10).map((error: any, idx: number) => (
                  <p key={idx} className="text-xs">
                    • Baris {error.row}: {error.message}
                  </p>
                ))}
                {importMessage.details.length > 10 && (
                  <p className="text-xs font-semibold mt-2">
                    ... dan {importMessage.details.length - 10} error lainnya
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
