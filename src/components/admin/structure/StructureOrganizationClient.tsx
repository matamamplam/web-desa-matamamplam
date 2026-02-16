"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import ImageUpload from "@/components/admin/ImageUpload"

interface Position {
  id: string
  category: string
  positionKey: string
  positionName: string
  level: number
  sortOrder: number
  dusunName?: string | null
  official?: Official | null
}

interface Official {
  id: string
  positionId: string
  name: string
  phone: string
  email?: string | null
  address?: string | null
  photo?: string | null
  startDate: string
  endDate?: string | null
  isActive: boolean
}

interface StructureOrganizationClientProps {
  initialPositions: Position[]
}

export default function StructureOrganizationClient({ initialPositions }: StructureOrganizationClientProps) {
  const router = useRouter()
  // Use props directly for rendering. 
  // Next.js router.refresh() will update this prop when server re-renders.
  const positions = initialPositions

  const [loading, setLoading] = useState(false)
  const [activeModal, setActiveModal] = useState<"position" | "official" | "edit" | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null)

  // Position form state
  const [positionForm, setPositionForm] = useState({
    positionKey: "",
    dusunName: "",
  })

  // Official form state
  const [officialForm, setOfficialForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    photo: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  const refreshData = () => {
    router.refresh()
  }

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!positionForm.positionKey || !positionForm.dusunName) {
      toast.error("Key dan nama dusun harus diisi")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/admin/structure/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionKey: `DUSUN_${positionForm.positionKey.toUpperCase()}`,
          dusunName: positionForm.dusunName,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Gagal menambah posisi")
      }

      toast.success("Posisi Kepala Dusun berhasil ditambahkan")
      setActiveModal(null)
      setPositionForm({ positionKey: "", dusunName: "" })
      refreshData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  const handleDeletePosition = async (positionId: string, dusunName: string) => {
    if (!confirm(`Hapus posisi Kepala Dusun ${dusunName}?`)) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/structure/positions/${positionId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Gagal menghapus posisi")
      }

      toast.success("Posisi berhasil dihapus")
      refreshData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  const handleAddOfficial = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPosition || !officialForm.name || !officialForm.phone) {
      toast.error("Nama dan nomor HP harus diisi")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/admin/structure/officials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionId: selectedPosition.id,
          ...officialForm,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Gagal menambah pejabat")
      }

      toast.success("Pejabat berhasil ditambahkan")
      setActiveModal(null)
      setSelectedPosition(null)
      resetOfficialForm()
      refreshData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  const handleUpdateOfficial = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedOfficial || !officialForm.name || !officialForm.phone) {
      toast.error("Nama dan nomor HP harus diisi")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/structure/officials/${selectedOfficial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(officialForm),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Gagal mengupdate pejabat")
      }

      toast.success("Pejabat berhasil diupdate")
      setActiveModal(null)
      setSelectedOfficial(null)
      resetOfficialForm()
      refreshData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  const handleDeleteOfficial = async (officialId: string, name: string) => {
    if (!confirm(`Hapus ${name} dari posisi?`)) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/structure/officials/${officialId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Gagal menghapus pejabat")
      }

      toast.success("Pejabat berhasil dihapus")
      refreshData()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
        setLoading(false)
    }
  }

  const openAddOfficialModal = (position: Position) => {
    setSelectedPosition(position)
    resetOfficialForm()
    setActiveModal("official")
  }

  const openEditOfficialModal = (position: Position, official: Official) => {
    setSelectedPosition(position)
    setSelectedOfficial(official)
    setOfficialForm({
      name: official.name,
      phone: official.phone,
      email: official.email || "",
      address: official.address || "",
      photo: official.photo || "",
      startDate: official.startDate.split("T")[0],
      endDate: official.endDate ? official.endDate.split("T")[0] : "",
    })
    setActiveModal("edit")
  }

  const resetOfficialForm = () => {
    setOfficialForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      photo: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    })
  }

  // Group positions by level for hierarchical display
  const positionsByLevel = positions.reduce((acc, pos) => {
    if (!acc[pos.level]) acc[pos.level] = []
    acc[pos.level].push(pos)
    return acc
  }, {} as Record<number, Position[]>)

  const levelLabels: Record<number, string> = {
    1: "Pimpinan Tertinggi",
    2: "Badan Permusyawaratan & Keagamaan",
    3: "Lembaga Kemasyarakatan",
    4: "Sekretariat",
    5: "Kepala Seksi",
    6: "Kepala Dusun",
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Struktur Organisasi Pemerintahan Gampong
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola struktur organisasi dan pejabat desa
            </p>
          </div>
          <button
            onClick={() => setActiveModal("position")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Tambah Kepala Dusun
          </button>
        </div>

        {/* Organizational Structure */}
        <div className="space-y-8">
          {[1, 2, 3, 4, 5, 6].map((level) => {
            const levelPositions = positionsByLevel[level] || []
            if (levelPositions.length === 0) return null

            return (
              <div key={level} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full mr-3 text-sm font-bold">
                    {level}
                  </span>
                  {levelLabels[level]}
                </h2>

                <div className={`grid gap-4 ${level === 1 ? "grid-cols-1 md:grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                  {levelPositions.map((position) => (
                    <div
                      key={position.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {position.positionName}
                          </h3>
                          {position.dusunName && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {position.dusunName}
                            </p>
                          )}
                        </div>
                        {position.category === "DUSUN" && (
                          <button
                            onClick={() => handleDeletePosition(position.id, position.dusunName || "")}
                            className="text-red-600 hover:text-red-700 text-sm"
                            title="Hapus Posisi"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {position.official ? (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-3">
                            {position.official.photo ? (
                              <img
                                src={position.official.photo}
                                alt={position.official.name}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-white truncate">
                                {position.official.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {position.official.phone}
                              </p>
                              {position.official.email && (
                                <p className="text-xs text-gray-500 truncate">
                                  {position.official.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => openEditOfficialModal(position, position.official!)}
                              className="flex-1 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteOfficial(position.official!.id, position.official!.name)}
                              className="flex-1 px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                            Posisi kosong
                          </p>
                          <button
                            onClick={() => openAddOfficialModal(position)}
                            className="w-full px-3 py-2 text-sm bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                          >
                            + Tambah Pejabat
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Position Modal */}
        {activeModal === "position" && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Tambah Kepala Dusun
              </h2>
              <form onSubmit={handleAddPosition} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Posisi (contoh: A, B, MEUNASAH)
                  </label>
                  <input
                    type="text"
                    value={positionForm.positionKey}
                    onChange={(e) => setPositionForm({ ...positionForm, positionKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama Dusun
                  </label>
                  <input
                    type="text"
                    value={positionForm.dusunName}
                    onChange={(e) => setPositionForm({ ...positionForm, dusunName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Dusun Meunasah"
                    required
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null)
                      setPositionForm({ positionKey: "", dusunName: "" })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add/Edit Official Modal */}
        {(activeModal === "official" || activeModal === "edit") && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6 my-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {activeModal === "edit" ? "Edit Pejabat" : "Tambah Pejabat"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Posisi: {selectedPosition?.positionName}
                {selectedPosition?.dusunName && ` - ${selectedPosition.dusunName}`}
              </p>

              <form onSubmit={activeModal === "edit" ? handleUpdateOfficial : handleAddOfficial} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foto
                  </label>
                  <ImageUpload
                    value={officialForm.photo}
                    onChange={(url) => setOfficialForm({ ...officialForm, photo: url })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={officialForm.name}
                      onChange={(e) => setOfficialForm({ ...officialForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nomor HP *
                    </label>
                    <input
                      type="text"
                      value={officialForm.phone}
                      onChange={(e) => setOfficialForm({ ...officialForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="081234567890"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={officialForm.email}
                    onChange={(e) => setOfficialForm({ ...officialForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={officialForm.address}
                    onChange={(e) => setOfficialForm({ ...officialForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Mulai
                    </label>
                    <input
                      type="date"
                      value={officialForm.startDate}
                      onChange={(e) => setOfficialForm({ ...officialForm, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tanggal Selesai (Opsional)
                    </label>
                    <input
                      type="date"
                      value={officialForm.endDate}
                      onChange={(e) => setOfficialForm({ ...officialForm, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModal(null)
                      setSelectedPosition(null)
                      setSelectedOfficial(null)
                      resetOfficialForm()
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {activeModal === "edit" ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[60]">
            <div className="bg-white p-4 rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        </div>
      )}
    </div>
  )
}
