"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Resident {
  id: string
  nama: string
  nik: string
}

export default function CreateBansosPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [residents, setResidents] = useState<Resident[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [searchResident, setSearchResident] = useState("")
  const [selectedResident, setSelectedResident] = useState<string>("")
  const [selectedResidentName, setSelectedResidentName] = useState<string>("")

  useEffect(() => {
    fetchResidents()
    fetchPrograms()
  }, [])

  const fetchResidents = async () => {
    try {
      const res = await fetch("/api/admin/penduduk?limit=1000&select=id,nama,nik")
      if (res.ok) {
        const result = await res.json()
        const residentsData = result.data?.penduduk || result.penduduk || []
        setResidents(Array.isArray(residentsData) ? residentsData : [])
      }
    } catch (err) {
      console.error("Failed to load residents")
      setResidents([])
    }
  }

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/admin/bansos/program")
      if (res.ok) {
        const data = await res.json()
        setPrograms(data)
      }
    } catch (err) {
      console.error("Failed to load programs")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!selectedResident) {
        toast.error("Silakan pilih penduduk terlebih dahulu")
        setIsLoading(false)
        return
    }

    const formData = new FormData(e.currentTarget)
    const data = {
      pendudukId: selectedResident,
      programId: formData.get("programId"),
      tahun: formData.get("tahun"),
      keterangan: formData.get("keterangan"),
      status: "AKTIF"
    }

    try {
      const res = await fetch("/api/admin/bansos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || "Gagal menyimpan data")
      }

      toast.success("Penerima bantuan berhasil ditambahkan")
      router.push("/admin/bansos")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter residents for autocomplete
  const filteredResidents = residents.filter(r => 
    r.nama.toLowerCase().includes(searchResident.toLowerCase()) || 
    r.nik.includes(searchResident)
  ).slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Penerima Bantuan</h1>
          <p className="mt-1 text-sm text-gray-600">
            Input data penerima bantuan sosial baru
          </p>
        </div>
        <Link
          href="/admin/bansos"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Kembali
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Penduduk Selection */}
          <div className="max-w-md relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Penduduk (Nama / NIK)
            </label>
            {selectedResident ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                        <p className="font-medium text-blue-900">{selectedResidentName}</p>
                        <p className="text-xs text-blue-700">ID Terpilih</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => { setSelectedResident(""); setSelectedResidentName(""); }}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                        Ubah
                    </button>
                    <input type="hidden" name="pendudukId" value={selectedResident} />
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={searchResident}
                        onChange={(e) => setSearchResident(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Ketik nama untuk mencari..."
                    />
                    {searchResident.length > 1 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredResidents.map(r => (
                                <div 
                                    key={r.id}
                                    onClick={() => {
                                        setSelectedResident(r.id);
                                        setSelectedResidentName(`${r.nama} - ${r.nik}`);
                                        setSearchResident("");
                                    }}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                >
                                    <p className="font-medium">{r.nama}</p>
                                    <p className="text-xs text-gray-500">{r.nik}</p>
                                </div>
                            ))}
                            {filteredResidents.length === 0 && (
                                <div className="p-3 text-gray-500 text-sm text-center">Tidak ditemukan</div>
                            )}
                        </div>
                    )}
                </>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-2">
                Program Bantuan <span className="text-red-500">*</span>
              </label>
              <select
                id="programId"
                name="programId"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Pilih Program --</option>
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.nama}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Program tidak ada? <Link href="/admin/bansos/program" className="text-blue-600 hover:underline">Tambah disini</Link>
              </p>
            </div>

            <div>
              <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-2">
                Tahun Anggaran <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="tahun"
                name="tahun"
                required
                defaultValue={new Date().getFullYear()}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan Tambahan
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Contoh: Tahap 1, Disalurkan via Pos"
            />
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
