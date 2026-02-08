"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ImageUpload from "./ImageUpload"
import Link from "next/link"

const projectSchema = z.object({
  title: z.string().min(5, "Nama proyek minimal 5 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  budget: z.string().or(z.number()).transform((v) => String(v)), // Handled as string to pass to API
  progress: z.string().or(z.number()).transform((v) => Number(v)),
  startDate: z.string().min(1, "Tanggal mulai harus diisi"),
  endDate: z.string().optional(),
  location: z.string().min(3, "Lokasi harus diisi"),
  status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"]),
  photoBefore: z.string().optional(),
  photoAfter: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  initialData?: any
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Format initial dates to YYYY-MM-DD for input[type="date"]
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return ""
    return new Date(date).toISOString().split("T")[0]
  }

  const defaultValues: any = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    budget: initialData?.budget || "0",
    progress: initialData?.progress || 0,
    startDate: formatDate(initialData?.startDate),
    endDate: formatDate(initialData?.endDate),
    location: initialData?.location || "",
    status: initialData?.status || "PLANNING",
    photoBefore: initialData?.photoBefore || "",
    photoAfter: initialData?.photoAfter || "",
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  })

  const photoBefore = watch("photoBefore")
  const photoAfter = watch("photoAfter")

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true)
    const loadingToast = toast.loading(initialData ? "Menyimpan perubahan..." : "Membuat data proyek...")

    try {
      const url = initialData ? `/api/admin/projects/${initialData.id}` : "/api/admin/projects"
      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Something went wrong")
      }

      toast.success(initialData ? "Proyek berhasil diperbarui" : "Proyek berhasil dibuat", { id: loadingToast })
      router.push("/admin/pembangunan")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
           <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Informasi Umum</h3>
           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nama Proyek</label>
                <input
                  {...register("title")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Contoh: Pembangunan Drainase Dusun B"
                  disabled={loading}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
             </div>

             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Jelaskan detail proyek..."
                  disabled={loading}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Anggaran (Rp)</label>
                <input
                  {...register("budget")}
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                  disabled={loading}
                />
                {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget.message}</p>}
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                <input
                  {...register("location")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nama Dusun / Jalan"
                  disabled={loading}
                />
                {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location.message}</p>}
             </div>
           </div>
        </div>

        {/* Status & Timeline */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Status & Jadwal</h3>
             <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Proyek</label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={loading}
                  >
                    <option value="PLANNING">Perencanaan (Planning)</option>
                    <option value="IN_PROGRESS">Sedang Berjalan (In Progress)</option>
                    <option value="ON_HOLD">Ditunda (On Hold)</option>
                    <option value="COMPLETED">Selesai (Completed)</option>
                  </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700">Progress (%)</label>
                   <div className="mt-1 flex items-center gap-4">
                      <input
                        {...register("progress")}
                        type="range"
                        min="0"
                        max="100"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={loading}
                      />
                      <span className="text-sm font-bold w-10 text-right">{watch("progress")}%</span>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Mulai</label>
                  <input
                    {...register("startDate")}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={loading}
                  />
                  {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tanggal Selesai (Opsional)</label>
                  <input
                    {...register("endDate")}
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    disabled={loading}
                  />
                </div>
             </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
           <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Dokumentasi</h3>
           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Foto Sebelum (0%)</label>
                 <ImageUpload
                   value={photoBefore || ""}
                   onChange={(val) => setValue("photoBefore", val)}
                   disabled={loading}
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Foto Sesudah (100%)</label>
                 <ImageUpload
                   value={photoAfter || ""}
                   onChange={(val) => setValue("photoAfter", val)}
                   disabled={loading}
                 />
              </div>
           </div>
        </div>

        <div className="flex justify-end gap-3 rounded-lg bg-gray-50 px-4 py-3 text-right sm:px-6">
           <Link
             href="/admin/pembangunan"
             className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
           >
             Batal
           </Link>
           <button
             type="submit"
             disabled={loading}
             className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
           >
             {loading ? "Menyimpan..." : "Simpan Data Proyek"}
           </button>
        </div>
      </form>
    </div>
  )
}
