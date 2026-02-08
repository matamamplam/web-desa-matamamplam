"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

type ComplaintFormValues = {
  title: string
  description: string
  categoryId: string
  location: string
  nik?: string
  phone?: string
}

interface ComplaintFormProps {
  categories: { id: string; name: string }[]
}

export default function ComplaintForm({ categories }: ComplaintFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ComplaintFormValues>()

  const onSubmit = async (data: ComplaintFormValues) => {
    setLoading(true)
    const toastIds = toast.loading("Mengirim laporan...")

    try {
      const res = await fetch("/api/public/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!res.ok) throw new Error("Gagal mengirim laporan")

      toast.success("Laporan berhasil dikirim. Terima kasih atas masukan Anda!", { id: toastIds })
      reset()
    } catch (error) {
       toast.error("Terjadi kesalahan, silakan coba lagi.", { id: toastIds })
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Laporan *</label>
                <input 
                {...register("title", { required: "Judul wajib diisi" })}
                type="text" 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Contoh: Lampu jalan mati di Dusun A"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select 
                {...register("categoryId", { required: "Pilih kategori" })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Kejadian</label>
                <input 
                {...register("location")}
                type="text" 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Nama Dusun / Jalan"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Isi Laporan *</label>
                <textarea 
                {...register("description", { required: "Deskripsi wajib diisi" })}
                rows={5}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Jelaskan detail permasalahan secara lengkap..."
                ></textarea>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIK (Opsional)</label>
                <input 
                {...register("nik")}
                type="text" 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Untuk verifikasi data penduduk"
                />
                <p className="mt-1 text-xs text-gray-500">Isi jika ingin laporan tercatat atas nama Anda.</p>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp (Opsional)</label>
                <input 
                    {...register("phone")}
                    type="text" 
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Contoh: 08123456789"
                />
                <p className="mt-1 text-xs text-gray-500">Agar kami bisa menghubungi Anda jika perlu.</p>
            </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
            <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex justify-center items-center rounded-lg border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
                {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Mengirim...
                </>
                ) : "Kirim Laporan"}
            </button>
        </div>

        </form>
    </div>
  )
}
