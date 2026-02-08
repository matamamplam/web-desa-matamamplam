"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { FiMapPin, FiPhone, FiUser, FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi"
import ImageUpload from "@/components/admin/ImageUpload"

interface PoskoManagerProps {
  eventId: string
}

export default function PoskoManager({ eventId }: PoskoManagerProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/disaster/posts?eventId=${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      toast.error("Gagal memuat data posko")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [eventId])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Daftar Posko Pengungsian</h3>
        <button
          onClick={() => {
            setEditData(null)
            setIsEditing(true)
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <FiPlus className="mr-2" />
          Tambah Posko
        </button>
      </div>

      {isEditing ? (
        <PoskoForm
          eventId={eventId}
          initialData={editData}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => {
            setIsEditing(false)
            fetchPosts()
          }}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {post.photo ? (
                  <img src={post.photo} alt={post.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FiMapPin size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button 
                        onClick={() => { setEditData(post); setIsEditing(true); }}
                        className="p-2 bg-white rounded-full shadow text-gray-600 hover:text-blue-600"
                    >
                        <FiEdit2 size={14} />
                    </button>
                    <button 
                        onClick={() => {
                            if (confirm("Hapus posko ini? Data tidak dapat dikembalikan.")) {
                                fetch(`/api/admin/disaster/posts?id=${post.id}`, { method: "DELETE" })
                                .then(res => {
                                    if(res.ok) {
                                        toast.success("Posko dihapus")
                                        fetchPosts()
                                    } else {
                                        toast.error("Gagal menghapus")
                                    }
                                })
                            }
                        }}
                        className="p-2 bg-white rounded-full shadow text-gray-600 hover:text-red-600"
                    >
                        <FiTrash2 size={14} />
                    </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="font-semibold text-lg text-gray-900">{post.name}</h4>
                <p className="text-gray-600 text-sm flex items-start">
                  <FiMapPin className="mt-0.5 mr-2 flex-shrink-0" />
                  {post.location}
                </p>
                <div className="pt-3 border-t flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <FiUser className="mr-1.5" />
                    {post.picName}
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="mr-1.5" />
                    {post.picPhone}
                  </div>
                </div>
                {post.facilities && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-semibold">Fasilitas:</span> {post.facilities}
                    </div>
                )}
                
                {/* Capacity Visualization */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Kapasitas Terisi:</span>
                        <span className="font-semibold text-gray-900">
                            {post._count?.refugees || 0} / {post.capacity}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                           className={`h-2 rounded-full ${
                               ((post._count?.refugees || 0) / (post.capacity || 1) * 100) > 90 
                               ? 'bg-red-500' 
                               : 'bg-green-500' 
                           }`} 
                           style={{ width: `${Math.min(((post._count?.refugees || 0) / (post.capacity || 1) * 100), 100)}%` }}
                        ></div>
                    </div>
                </div>

                {(post.locationLink || (post.latitude && post.longitude)) && (
                   <a 
                     href={post.locationLink || `https://www.google.com/maps?q=${post.latitude},${post.longitude}`} 
                     target="_blank" 
                     rel="noreferrer"
                     className="block text-center w-full py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm mt-3"
                   >
                     Lihat Peta Lokasi
                   </a>
                )}
              </div>
            </div>
          ))}
          
          {posts.length === 0 && !loading && (
             <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                <p>Belum ada posko yang terdaftar.</p>
             </div>
          )}
        </div>
      )}
    </div>
  )
}

function PoskoForm({ eventId, initialData, onCancel, onSuccess }: any) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      name: "",
      location: "",
      picName: "",
      picPhone: "",
      capacity: "",
      facilities: "",
      locationLink: "",
      mapEmbedUrl: "",
      photo: ""
    }
  })

  // Watch photo for ImageUpload
  const photo = watch("photo")

  const onSubmit = async (data: any) => {
    try {
      const url = "/api/admin/disaster/posts" 
      const method = initialData ? "PUT" : "POST"
      
      const payload = initialData ? { ...data, id: initialData.id, eventId } : { ...data, eventId }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(initialData ? "Gagal mengubah posko" : "Gagal menyimpan posko")
      
      toast.success(initialData ? "Posko berhasil diubah" : "Posko berhasil disimpan")
      onSuccess()
    } catch (error) {
      toast.error("Gagal menyimpan data")
    }
  }

  return (
    <div className="bg-white border rounded-lg p-6 max-w-2xl mx-auto shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-6 px-1">
        {initialData ? "Edit Posko" : "Tambah Posko Baru"}
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Posko</label>
          <input
            {...register("name", { required: "Nama posko wajib diisi" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Misal: Posko Kantor Desa"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Alamat)</label>
          <textarea
            {...register("location", { required: "Lokasi wajib diisi" })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Detail lokasi posko..."
          />
        </div>

             <div className="space-y-3">
                 <label className="block text-sm font-medium text-gray-700">Lokasi Peta (Link Google Maps)</label>
                 <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 mb-2">
                    Masukkan link Google Maps (msl: https://maps.app.goo.gl/...)
                 </div>
                 <input
                   {...register("locationLink")}
                   className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                   placeholder="https://maps.app.goo.gl/..."
                 />
                 
                 <div className="relative pt-4">
                    <span className="bg-white px-2 text-gray-500 text-xs absolute top-2 left-1/2 transform -translate-x-1/2">
                       Opsional: Embed Peta (Iframe)
                    </span>
                    <div className="border-t border-gray-200"></div>
                 </div>

                 <label className="block text-sm font-medium text-gray-700 mt-2">Embed Code (Iframe)</label>
                 <textarea
                   {...register("mapEmbedUrl")}
                   rows={3}
                   className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-xs"
                   placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
                 />
            </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama PIC</label>
            <input
              {...register("picName", { required: "Wajib diisi" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No. HP PIC</label>
            <input
              {...register("picPhone", { required: "Wajib diisi" })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
            <input
              {...register("capacity")}
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Jumlah orang"
            />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Fasilitas</label>
           <input
             {...register("facilities")}
             className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
             placeholder="Dapur umum, MCK, Tenda Medis..."
           />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Posko</label>
            <ImageUpload 
               value={photo || ""} 
               onChange={(val) => setValue("photo", val)} 
            />
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Posko"}
          </button>
        </div>
      </form>
    </div>
  )
}
