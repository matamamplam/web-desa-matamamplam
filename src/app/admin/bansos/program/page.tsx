"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { FiPlus, FiEdit2, FiTrash2, FiActivity } from "react-icons/fi"

interface ProgramBansos {
  id: string
  nama: string
  keterangan: string | null
  isActive: boolean
  _count?: {
    bansos: number
  }
}

export default function ProgramBansosPage() {
  const [programs, setPrograms] = useState<ProgramBansos[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ id: "", nama: "", keterangan: "", isActive: true })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/admin/bansos/program")
      if (res.ok) {
        const data = await res.json()
        setPrograms(data)
      }
    } catch (error) {
      toast.error("Gagal memuat data program")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = formData.id 
        ? `/api/admin/bansos/program/${formData.id}`
        : "/api/admin/bansos/program"
      
      const method = formData.id ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message)

      toast.success(formData.id ? "Program diperbarui" : "Program ditambahkan")
      fetchPrograms()
      setIsModalOpen(false)
      setFormData({ id: "", nama: "", keterangan: "", isActive: true })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus program "${nama}"?`)) return

    try {
      const res = await fetch(`/api/admin/bansos/program/${id}`, { method: "DELETE" })
      const result = await res.json()
      
      if (!res.ok) throw new Error(result.message)

      toast.success("Program dihapus")
      fetchPrograms()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Program Bantuan Sosial</h1>
          <p className="text-sm text-gray-500">Kelola jenis bantuan sosial yang tersedia</p>
        </div>
        <button
          onClick={() => {
            setFormData({ id: "", nama: "", keterangan: "", isActive: true })
            setIsModalOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> Tambah Program
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program) => (
          <div key={program.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg text-gray-900">{program.nama}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${program.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {program.isActive ? 'Aktif' : 'Non-Aktif'}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{program.keterangan || "Tidak ada keterangan"}</p>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <FiActivity /> status
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setFormData({
                      id: program.id,
                      nama: program.nama,
                      keterangan: program.keterangan || "",
                      isActive: program.isActive
                    })
                    setIsModalOpen(true)
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDelete(program.id, program.nama)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{formData.id ? "Edit Program" : "Tambah Program"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Program</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Contoh: BLT Dana Desa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                <textarea
                  value={formData.keterangan}
                  onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Program Aktif</label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
