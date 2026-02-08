"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface DeleteButtonProps {
  id: string
  apiEndpoint?: string
  onSuccess?: () => void
  label?: string
  btnClass?: string
  iconSize?: string // Used if default icon is rendering, though we might just use svg direct
}

export default function DeleteButton({ 
  id, 
  apiEndpoint = "/api/admin/letter-requests", 
  onSuccess,
  label = "Hapus",
  btnClass = "ml-4 text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50",
  iconSize = "h-5 w-5"
}: DeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-red-600">Hapus Permanen?</p>
          <p className="text-xs text-gray-600">Tindakan ini tidak dapat dibatalkan.</p>
          <div className="flex gap-2">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="flex-1 rounded bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700"
            >
              Hapus
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="flex-1 rounded bg-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-300"
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
      const url = `${apiEndpoint}/${id}`
      const response = await fetch(url, { method: "DELETE" })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Gagal menghapus")
      }

      toast.success("Berhasil dihapus", { id: loadingToast })
      if (onSuccess) onSuccess()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Gagal", { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={btnClass}
      title={label}
    >
      {loading ? (
         <span className="animate-spin inline-block">...</span> 
      ) : label === "Hapus" && btnClass.includes("p-1") ? (
        // Render Icon if simplified class is detected or just standard Trash icon
        <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ) : (
        label
      )}
    </button>
  )
}
