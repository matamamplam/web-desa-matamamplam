"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import TiptapEditor from "./TiptapEditor"
import ImageUpload from "./ImageUpload"
import Link from "next/link"

const newsSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  excerpt: z.string().optional(),
  content: z.string().min(20, "Konten berita terlalu pendek"),
  thumbnail: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
})

type NewsFormValues = z.infer<typeof newsSchema>

interface NewsFormProps {
  initialData?: any
  categories: { id: string; name: string }[]
}

export default function NewsForm({ initialData, categories }: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const defaultValues: NewsFormValues = {
    title: initialData?.title || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    thumbnail: initialData?.thumbnail || "",
    status: initialData?.status || "DRAFT",
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues,
  })

  // Watch content/thumbnail for custom inputs
  const content = watch("content")
  const thumbnail = watch("thumbnail")

  const onSubmit = async (data: NewsFormValues) => {
    setLoading(true)
    const loadingToast = toast.loading(initialData ? "Menyimpan perubahan..." : "Membuat berita...")

    try {
      const url = initialData ? `/api/admin/news/${initialData.id}` : "/api/admin/news"
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

      toast.success(initialData ? "Berita berhasil diperbarui" : "Berita berhasil dibuat", { id: loadingToast })
      router.push("/admin/berita")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Main Content (Left Column) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Judul Berita</label>
                <input
                  {...register("title")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Masukkan judul berita..."
                  disabled={loading}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Ringkasan (Excerpt)</label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ringkasan singkat berita..."
                  disabled={loading}
                />
              </div>

               {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Konten Berita</label>
                <TiptapEditor
                  value={content}
                  onChange={(val) => setValue("content", val, { shouldValidate: true })}
                  disabled={loading}
                />
                {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
             {/* Publish Options */}
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Publikasi</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register("status")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={loading}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  {...register("categoryId")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  disabled={loading}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                 {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
              </div>
            
              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Berita"}
                </button>
                 <Link
                   href="/admin/berita"
                   className="w-full flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 text-center"
                 >
                   Batal
                 </Link>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
               <h3 className="font-semibold text-gray-900 border-b pb-2">Gambar Utama</h3>
               <ImageUpload
                 value={thumbnail || ""}
                 onChange={(val) => setValue("thumbnail", val)}
                 disabled={loading}
               />
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
