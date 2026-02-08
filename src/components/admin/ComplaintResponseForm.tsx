"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface ComplaintResponseFormProps {
  complaintId: string
  initialStatus: string
  initialResponse?: string | null
}

const STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Diajukan (Submitted)" },
  { value: "IN_REVIEW", label: "Sedang Ditinjau (In Review)" },
  { value: "IN_PROGRESS", label: "Sedang Diproses (In Progress)" },
  { value: "RESOLVED", label: "Selesai (Resolved)" },
  { value: "CLOSED", label: "Ditutup (Closed)" },
]

export default function ComplaintResponseForm({
  complaintId,
  initialStatus,
  initialResponse
}: ComplaintResponseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(initialStatus)
  const [response, setResponse] = useState(initialResponse || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const loadingToast = toast.loading("Menyimpan tanggapan...")

    try {
      const res = await fetch(`/api/admin/complaints/${complaintId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, response }),
      })

      if (!res.ok) {
        throw new Error("Gagal menyimpan data")
      }

      toast.success("Pengaduan berhasil diperbarui", { id: loadingToast })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">
        Tanggapan & Status
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
           <label className="block text-sm font-medium text-gray-700">Update Status</label>
           <select
             value={status}
             onChange={(e) => setStatus(e.target.value)}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             disabled={loading}
           >
             {STATUS_OPTIONS.map((opt) => (
               <option key={opt.value} value={opt.value}>{opt.label}</option>
             ))}
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Tanggapan Resmi</label>
           <textarea
             value={response}
             onChange={(e) => setResponse(e.target.value)}
             rows={5}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             placeholder="Tulis tanggapan atau tindakan yang diambil..."
             disabled={loading}
           />
           <p className="mt-1 text-xs text-gray-500">Tanggapan akan terlihat oleh pelapor jika fitur publik diaktifkan.</p>
        </div>

        <div className="flex justify-end">
           <button
             type="submit"
             disabled={loading}
             className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
           >
             {loading ? "Menyimpan..." : "Simpan Perubahan"}
           </button>
        </div>
      </form>
    </div>
  )
}
