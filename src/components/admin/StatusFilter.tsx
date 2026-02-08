"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface StatusFilterProps {
  currentStatus?: string
}

const statusOptions = [
  { value: "ALL", label: "Semua Status" },
  { value: "PENDING", label: "Menunggu" },
  { value: "PROCESSING", label: "Diproses" },
  { value: "APPROVED", label: "Disetujui" },
  { value: "REJECTED", label: "Ditolak" },
  { value: "COMPLETED", label: "Selesai" },
]

export default function StatusFilter({ currentStatus }: StatusFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (newStatus === "ALL") {
      params.delete("status")
    } else {
      params.set("status", newStatus)
    }
    params.delete("page")
    
    router.push(`/admin/layanan-surat/permohonan?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            id="status"
            value={currentStatus || "ALL"}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="ml-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
