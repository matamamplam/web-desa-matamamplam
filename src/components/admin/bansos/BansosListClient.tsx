"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Bansos {
  id: string
  pendudukId: string
  program: {
    nama: string
  } | null
  keterangan: string | null
  status: string
  tahun: number
  penerima: {
    nama: string
    nik: string
  }
}

export function BansosListClient({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [bansosList, setBansosList] = useState<Bansos[]>(initialData)
  const [search, setSearch] = useState("")

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return

    try {
      const res = await fetch(`/api/admin/bansos/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Gagal menghapus")
      
      setBansosList(bansosList.filter(item => item.id !== id))
      toast.success("Data berhasil dihapus")
      router.refresh()
    } catch (err) {
      toast.error("Gagal menghapus data")
    }
  }

  const filteredList = bansosList.filter(item => 
    item.penerima.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.penerima.nik.includes(search) ||
    item.program?.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Bantuan Sosial</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data penerima bantuan sosial desa
          </p>
        </div>
        <div className="flex gap-2">
            <Link
            href="/admin/bansos/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Penerima
            </Link>
            <Link
            href="/admin/bansos/program"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
            Kelola Program
            </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Cari nama, NIK, atau jenis bantuan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada data bantuan sosial.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bantuan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.penerima.nama}</div>
                      <div className="text-sm text-gray-500">{item.penerima.nik}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.program?.nama || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tahun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === "AKTIF" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
