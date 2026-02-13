"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { FiFilter, FiSearch, FiHome, FiEdit2, FiSave, FiX } from "react-icons/fi"

interface HouseData {
  id: string
  noKK: string
  kepalaKeluarga: string
  alamat: string
  dusun: string | null
  jenisRumah: string | null
}

const HOUSE_TYPES = [
  { value: "PERMANEN", label: "Permanen" },
  { value: "SEMI_PERMANEN", label: "Semi Permanen" },
  { value: "KAYU", label: "Kayu" },
  { value: "NUMPANG", label: "Numpang" },
  { value: "TIDAK_PUNYA", label: "Tidak Punya" },
]

export function HouseDataClient({ initialData }: { initialData: HouseData[] }) {
  const [houses, setHouses] = useState<HouseData[]>(initialData)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterDusun, setFilterDusun] = useState("")
  
  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = (house: HouseData) => {
    setEditingId(house.id)
    setEditValue(house.jenisRumah || "")
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/kk/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jenisRumah: editValue }),
      })

      if (!res.ok) throw new Error("Gagal menyimpan")

      setHouses(houses.map(h => h.id === id ? { ...h, jenisRumah: editValue } : h))
      toast.success("Jenis rumah diperbarui")
      setEditingId(null)
    } catch (error) {
      toast.error("Gagal menyimpan perubahan")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredHouses = houses.filter(h => {
    const matchSearch = h.kepalaKeluarga.toLowerCase().includes(search.toLowerCase()) || 
                        h.noKK.includes(search) ||
                        h.alamat.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType ? h.jenisRumah === filterType : true
    const matchDusun = filterDusun ? h.dusun === filterDusun : true
    return matchSearch && matchType && matchDusun
  })

  // Group stats
  const stats = HOUSE_TYPES.reduce((acc, type) => {
    acc[type.value] = houses.filter(h => h.jenisRumah === type.value).length
    return acc
  }, {} as Record<string, number>)
  
  const unknownCount = houses.filter(h => !h.jenisRumah).length

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiHome className="text-blue-600" /> Data Rumah Warga
          </h1>
          <p className="text-sm text-gray-500">Rekapitulasi kondisi rumah tempat tinggal warga desa</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {HOUSE_TYPES.map(type => (
          <div key={type.value} className="bg-white p-3 rounded-lg border shadow-sm text-center">
            <div className="text-xs text-gray-500 uppercase font-semibold">{type.label}</div>
            <div className="text-xl font-bold text-blue-600">{stats[type.value]}</div>
          </div>
        ))}
        <div className="bg-white p-3 rounded-lg border shadow-sm text-center border-orange-200 bg-orange-50">
           <div className="text-xs text-orange-600 uppercase font-semibold">Belum Data</div>
           <div className="text-xl font-bold text-orange-700">{unknownCount}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Cari Kepala Keluarga, No KK, Alamat..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
        </div>
        <select 
            value={filterDusun} 
            onChange={e => setFilterDusun(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">Semua Dusun</option>
            <option value="Dusun Bale Situi">Dusun Bale Situi</option>
            <option value="Dusun Muda Intan">Dusun Muda Intan</option>
            <option value="Dusun Kolam">Dusun Kolam</option>
        </select>
        <select 
            value={filterType} 
            onChange={e => setFilterType(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        >
            <option value="">Semua Tipe Rumah</option>
            {HOUSE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
            ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kepala Keluarga / KK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Rumah</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHouses.length === 0 ? (
                <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">Tidak ada data ditemukan</td>
                </tr>
              ) : (
                filteredHouses.map(house => (
                    <tr key={house.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{house.kepalaKeluarga}</div>
                            <div className="text-sm text-gray-500">{house.noKK}</div>
                            <div className="text-xs text-gray-400 mt-1">{house.alamat}</div>
                        </td>
                        <td className="px-6 py-4">
                            {editingId === house.id ? (
                                <select 
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="text-sm border rounded px-2 py-1 w-full"
                                    autoFocus
                                >
                                    <option value="">- Pilih -</option>
                                    {HOUSE_TYPES.map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    house.jenisRumah ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {house.jenisRumah ? house.jenisRumah.replace(/_/g, " ") : "Belum Set"}
                                </span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                            {editingId === house.id ? (
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleSave(house.id)} 
                                        disabled={isSaving}
                                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                        title="Simpan"
                                    >
                                        <FiSave className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => setEditingId(null)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Batal"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleEdit(house)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit Jenis Rumah"
                                >
                                    <FiEdit2 className="w-4 h-4" />
                                </button>
                            )}
                        </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
