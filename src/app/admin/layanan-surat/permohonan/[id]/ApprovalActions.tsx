"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface ApprovalActionsProps {
  request: {
    id: string
    status: string
    nomorSurat: string
    pdfUrl: string | null
    verificationCode: string | null
    phoneNumber: string | null
  }
}

export default function ApprovalActions({ request }: ApprovalActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [notes, setNotes] = useState("")
  const [letterNumber, setLetterNumber] = useState("")
  const [error, setError] = useState("")

  const handleApprove = async () => {
    if (!letterNumber.trim()) {
      toast.error("Nomor surat wajib diisi")
      return
    }

    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Konfirmasi Persetujuan</p>
          <p className="text-sm text-gray-600">
            Pastikan nomor surat <strong>{letterNumber}</strong> sudah benar.
            <br />
            Apakah Anda yakin ingin menyetujui permohonan ini?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="flex-1 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Ya, Setujui
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="flex-1 rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      ), { duration: Infinity })
    })
    if (!confirmed) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/letter-requests/${request.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, letterNumber }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve request")
      }

      toast.success(`Permohonan disetujui!\nNomor Surat: ${data.letterNumber}`, {
        duration: 5000,
      })
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
      setAction(null)
      setNotes("")
      setLetterNumber("")
    }
  }

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error("Silakan tambahkan alasan penolakan")
      return
    }

    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-red-600">Konfirmasi Penolakan</p>
          <p className="text-sm text-gray-600">Apakah Anda yakin ingin menolak permohonan ini?</p>
          <div className="flex gap-2">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Ya, Tolak
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="flex-1 rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </div>
      ), { duration: Infinity })
    })
    if (!confirmed) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/letter-requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED", notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reject request")
      }

      toast.success("Permohonan ditolak")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setAction(null)
      setNotes("")
    }
  }

  const handleProcessing = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/letter-requests/${request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PROCESSING" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canApprove = request.status === "PENDING" || request.status === "PROCESSING"
  const canReject = request.status === "PENDING" || request.status === "PROCESSING"
  const canSetProcessing = request.status === "PENDING"

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">Tindakan</h3>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* WhatsApp Notification Button */}
        {request.status === "APPROVED" && request.phoneNumber && request.verificationCode && (
          <a
            href={`https://wa.me/${request.phoneNumber.replace(/^0/, "62")}?text=${encodeURIComponent(
              `Halo, Surat Anda dengan nomor *${request.nomorSurat}* telah Selesai dan Disetujui.\n\n` +
              `Kode Verifikasi: *${request.verificationCode}*\n` +
              `Silakan cek dan unduh surat Anda di: ${process.env.NEXT_PUBLIC_APP_URL || "https://matamamplam.my.id"}/cek-surat/${request.verificationCode}\n\n` +
              `Terima kasih.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.683-2.031-9.667-.272-.099-.47-.149-.669-.149-.198 0-.42.001-.643.001-.223 0-.586.085-.892.41-.307.325-1.177 1.151-1.177 2.809 0 1.658 1.206 3.26 1.375 3.484.169.224 2.373 3.623 5.751 5.08 3.376 1.458 4.06 1.168 4.793 1.094.734-.074 1.758-.718 2.006-1.412.248-.694.248-1.289.173-1.413z" />
            </svg>
            Kirim Notifikasi WA
          </a>
        )}

        {/* Print Button - Available for Approved/Completed */}
        {(request.status === "APPROVED" || request.status === "COMPLETED") && (
          <a
            href={`/admin/layanan-surat/cetak/${request.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak / Preview Surat
          </a>
        )}

        {request.status === "REJECTED" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-sm font-medium text-red-800">Permohonan Ditolak</p>
          </div>
        )}

        {/* Action to Mark as Completed */}
        {request.status === "APPROVED" && (
          <div className="space-y-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-800">
                Surat telah disetujui. Silakan cetak surat, lalu tandai sebagai selesai jika sudah diserahkan.
              </p>
            </div>
            <button
              onClick={async () => {
                const confirmed = await new Promise((resolve) => {
                  toast((t) => (
                    <div className="flex flex-col gap-3">
                      <p className="font-semibold">Selesaikan Permohonan?</p>
                      <p className="text-sm text-gray-600">
                        Tandai permohonan ini sebagai SELESAI. Pastikan surat sudah dicetak dan ditandatangani.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { toast.dismiss(t.id); resolve(true); }}
                          className="flex-1 rounded bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Ya, Selesai
                        </button>
                        <button
                          onClick={() => { toast.dismiss(t.id); resolve(false); }}
                          className="flex-1 rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ), { duration: Infinity })
                })
                if (!confirmed) return
                
                setLoading(true)
                setError("")
                const loadingToast = toast.loading("Memproses...")
                try {
                  // Reuse the generate-pdf endpoint but now it just marks as completed
                  const response = await fetch(`/api/admin/letter-requests/${request.id}/generate-pdf`, {
                    method: "POST",
                  })
                  const data = await response.json()
                  if (!response.ok) {
                    throw new Error(data.message || "Gagal update status")
                  }
                  toast.success("Permohonan ditandai Selesai!", { id: loadingToast })
                  router.refresh()
                } catch (err: any) {
                  toast.error(err.message, { id: loadingToast })
                  setError(err.message)
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {loading ? "Memproses..." : "Tandai Selesai"}
            </button>
          </div>
        )}

        {canSetProcessing && (
          <button
            onClick={handleProcessing}
            disabled={loading}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            Tandai Sedang Diproses
          </button>
        )}

        {canApprove && !action && (
          <button
            onClick={() => setAction("approve")}
            disabled={loading}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Setujui Permohonan
          </button>
        )}

        {canReject && !action && (
          <button
            onClick={() => setAction("reject")}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Tolak Permohonan
          </button>
        )}

        {action === "approve" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nomor Surat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={letterNumber}
                onChange={(e) => setLetterNumber(e.target.value)}
                placeholder="Contoh: 470/001/2026"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Masukkan nomor surat resmi sesuai format desa.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Catatan (opsional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Tambahkan catatan jika diperlukan..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Konfirmasi Setuju"}
              </button>
              <button
                onClick={() => {
                  setAction(null)
                  setNotes("")
                  setLetterNumber("")
                }}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {action === "reject" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                required
                placeholder="Jelaskan alasan penolakan..."
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Konfirmasi Tolak"}
              </button>
              <button
                onClick={() => {
                  setAction(null)
                  setNotes("")
                }}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Action - Only for PENDING or REJECTED */}
      {(request.status === "PENDING" || request.status === "REJECTED") && (
        <div className="rounded-lg border border-red-200 bg-white p-4 shadow-sm">
          <h3 className="mb-2 font-semibold text-red-900">Hapus Permohonan</h3>
          <p className="mb-4 text-sm text-gray-600">
            Tindakan ini tidak dapat dibatalkan. Data permohonan akan dihapus permanen.
          </p>
          <button
            onClick={async () => {
              const confirmed = await new Promise((resolve) => {
                toast((t) => (
                  <div className="flex flex-col gap-3">
                    <p className="font-semibold text-red-600">Hapus Permanen?</p>
                    <p className="text-sm text-gray-600">
                      Apakah Anda yakin ingin menghapus permohonan ini?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { toast.dismiss(t.id); resolve(true); }}
                        className="flex-1 rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        onClick={() => { toast.dismiss(t.id); resolve(false); }}
                        className="flex-1 rounded bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ), { duration: Infinity })
              })
              if (!confirmed) return

              setLoading(true)
              const loadingToast = toast.loading("Menghapus...")
              try {
                const response = await fetch(`/api/admin/letter-requests/${request.id}`, {
                  method: "DELETE",
                })
                
                if (!response.ok) {
                  const data = await response.json()
                  throw new Error(data.message || "Gagal menghapus permohonan")
                }

                toast.success("Permohonan berhasil dihapus", { id: loadingToast })
                router.push("/admin/layanan-surat/permohonan")
              } catch (err: any) {
                toast.error(err.message, { id: loadingToast })
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Hapus Permohonan
          </button>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3 text-sm text-blue-700">
            <p className="font-medium">Catatan:</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              <li>Isi nomor surat secara manual (wajib)</li>
              <li>PDF surat akan dibuat otomatis setelah persetujuan</li>
              <li>Penolakan wajib disertai alasan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
