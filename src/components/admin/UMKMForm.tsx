"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ImageUpload from "./ImageUpload"
import Link from "next/link"

const umkmSchema = z.object({
  name: z.string().min(3, "Nama UMKM minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori harus dipilih"),
  ownerName: z.string().min(3, "Nama pemilik minimal 3 karakter"),
  ownerPhone: z.string().min(10, "Nomor HP minimal 10 digit"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  mapsUrl: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().default(true),
})

type UMKMFormValues = z.infer<typeof umkmSchema>

interface UMKMFormProps {
  initialData?: any
  categories: { id: string; name: string }[]
}

export default function UMKMForm({ initialData, categories }: UMKMFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const defaultValues: UMKMFormValues = {
    name: initialData?.name || "",
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    ownerName: initialData?.ownerName || "",
    ownerPhone: initialData?.ownerPhone || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    mapsUrl: initialData?.mapsUrl || "",
    logo: initialData?.logo || "",
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UMKMFormValues>({
    resolver: zodResolver(umkmSchema),
    defaultValues,
  })

  // Watch logo for ImageUpload
  const logo = watch("logo")
  const isActive = watch("isActive")

  const onSubmit = async (data: UMKMFormValues) => {
    setLoading(true)
    const loadingToast = toast.loading(initialData ? "Menyimpan perubahan..." : "Menambahkan UMKM...")

    try {
      const url = initialData ? `/api/admin/umkm/${initialData.id}` : "/api/admin/umkm"
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

      toast.success(initialData ? "Data UMKM diperbarui" : "UMKM berhasil ditambahkan", { id: loadingToast })
      router.push("/admin/umkm")
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
          
          {/* Main Info (Left Column) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Informasi Usaha</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Usaha</label>
                <input
                  {...register("name")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Contoh: Keripik Singkong Barokah"
                  disabled={loading}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Jelaskan produk dan layanan..."
                  disabled={loading}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea
                  {...register("address")}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Alamat lokasi usaha..."
                  disabled={loading}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700">Link Google Maps (Opsional)</label>
                <input
                  {...register("mapsUrl")}
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://maps.google.com/..."
                  disabled={loading}
                />
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
               <h3 className="font-semibold text-gray-900 border-b pb-2">Informasi Pemilik</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Pemilik</label>
                    <input
                      {...register("ownerName")}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Nama lengkap pemilik"
                      disabled={loading}
                    />
                    {errors.ownerName && <p className="mt-1 text-xs text-red-500">{errors.ownerName.message}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor HP / WA</label>
                    <input
                      {...register("ownerPhone")}
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0812..."
                      disabled={loading}
                    />
                    {errors.ownerPhone && <p className="mt-1 text-xs text-red-500">{errors.ownerPhone.message}</p>}
                 </div>
               </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
             {/* Settings */}
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">Pengaturan</h3>
              
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

               <div className="flex items-center gap-2 mt-4">
                  <input
                    {...register("isActive")}
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">
                    Status Aktif
                  </label>
              </div>
            
              <div className="pt-4 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : "Simpan Data"}
                </button>
                 <Link
                   href="/admin/umkm"
                   className="w-full flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 text-center"
                 >
                   Batal
                 </Link>
              </div>
            </div>

            {/* Logo */}
            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 space-y-4">
               <h3 className="font-semibold text-gray-900 border-b pb-2">Logo / Foto Usaha</h3>
               <ImageUpload
                 value={logo || ""}
                 onChange={(val) => setValue("logo", val)}
                 disabled={loading}
               />
               <p className="text-xs text-gray-500">Upload logo atau foto tempat usaha.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
