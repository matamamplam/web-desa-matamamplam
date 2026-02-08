"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ImageUpload from "./ImageUpload"
import Link from "next/link"

const gallerySchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  mediaUrl: z.string().min(1, "Foto harus diupload"),
})

type GalleryFormValues = z.infer<typeof gallerySchema>

interface GalleryFormProps {
  categories: { id: string; name: string }[]
}

export default function GalleryForm({ categories }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      categoryId: categories.length > 0 ? categories[0].id : "",
    }
  })

  const mediaUrl = watch("mediaUrl")

  const onSubmit = async (data: GalleryFormValues) => {
    setLoading(true)
    const loadingToast = toast.loading("Mengupload foto...")

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Gagal menyimpan foto")
      }

      toast.success("Foto berhasil ditambahkan", { id: loadingToast })
      router.push("/admin/galeri")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul Foto</label>
          <input
            {...register("title")}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Contoh: Kegiatan Gotong Royong"
            disabled={loading}
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Kategori</label>
           <select
             {...register("categoryId")}
             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
             disabled={loading}
           >
             {categories.map((c) => (
               <option key={c.id} value={c.id}>{c.name}</option>
             ))}
           </select>
            {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi (Opsional)</label>
          <textarea
            {...register("description")}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Keterangan foto..."
            disabled={loading}
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Upload Foto</label>
           <ImageUpload
             value={mediaUrl || ""}
             onChange={(val) => setValue("mediaUrl", val)}
             disabled={loading}
           />
           {errors.mediaUrl && <p className="mt-1 text-xs text-red-500">{errors.mediaUrl.message}</p>}
        </div>

        <div className="flex gap-3 pt-4">
           <button
             type="submit"
             disabled={loading}
             className="flex-1 justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
           >
             {loading ? "Menyimpan..." : "Simpan Foto"}
           </button>
           <Link
             href="/admin/galeri"
             className="flex-none inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
           >
             Batal
           </Link>
        </div>
      </form>
    </div>
  )
}
