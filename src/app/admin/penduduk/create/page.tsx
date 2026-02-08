"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface KK {
  id: string
  noKK: string
  kepalaKeluarga: string
  rt: string
  rw: string
}

export default function CreatePendudukPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [kkList, setKkList] = useState<KK[]>([])
  const [kkSearch, setKkSearch] = useState("")

  useEffect(() => {
    fetchKKList()
  }, [])

  const fetchKKList = async (search?: string) => {
    try {
      const url = search
        ? `/api/admin/kk?search=${encodeURIComponent(search)}`
        : "/api/admin/kk"
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setKkList(data)
      }
    } catch (err) {
      console.error("Failed to fetch KK list:", err)
    }
  }

  const handleKKSearch = (value: string) => {
    setKkSearch(value)
    if (value.length >= 3 || value.length === 0) {
      fetchKKList(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      kkId: formData.get("kkId"),
      nik: formData.get("nik"),
      nama: formData.get("nama"),
      jenisKelamin: formData.get("jenisKelamin"),
      tempatLahir: formData.get("tempatLahir"),
      tanggalLahir: formData.get("tanggalLahir"),
      agama: formData.get("agama"),
      pendidikan: formData.get("pendidikan"),
      pekerjaan: formData.get("pekerjaan"),
      statusPerkawinan: formData.get("statusPerkawinan"),
      hubunganDalamKeluarga: formData.get("hubunganDalamKeluarga"),
      namaAyah: formData.get("namaAyah") || undefined,
      namaIbu: formData.get("namaIbu") || undefined,
      golonganDarah: formData.get("golonganDarah") || undefined,
      kewarganegaraan: formData.get("kewarganegaraan") || "WNI",
    }

    try {
      const res = await fetch("/api/admin/penduduk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Gagal menyimpan data")
      }

      router.push("/admin/penduduk")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Data Penduduk</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masukkan data penduduk baru
          </p>
        </div>
        <Link
          href="/admin/penduduk"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </Link>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Kartu Keluarga */}
          <div>
            <label htmlFor="kkId" className="block text-sm font-medium text-gray-700 mb-2">
              Kartu Keluarga <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Cari No. KK atau Kepala Keluarga..."
              value={kkSearch}
              onChange={(e) => handleKKSearch(e.target.value)}
              className="w-full mb-2 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <select
              id="kkId"
              name="kkId"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Pilih Kartu Keluarga</option>
              {kkList.map((kk) => (
                <option key={kk.id} value={kk.id}>
                  {kk.noKK} - {kk.kepalaKeluarga} (RT {kk.rt}/RW {kk.rw})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nik" className="block text-sm font-medium text-gray-700 mb-2">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nik"
                name="nik"
                required
                maxLength={16}
                pattern="[0-9]{16}"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="16 digit"
              />
            </div>

            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                id="jenisKelamin"
                name="jenisKelamin"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>

            <div>
              <label htmlFor="hubunganDalamKeluarga" className="block text-sm font-medium text-gray-700 mb-2">
                Hub. dalam Keluarga <span className="text-red-500">*</span>
              </label>
              <select
                id="hubunganDalamKeluarga"
                name="hubunganDalamKeluarga"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="KEPALA_KELUARGA">Kepala Keluarga</option>
                <option value="SUAMI">Suami</option>
                <option value="ISTRI">Istri</option>
                <option value="ANAK">Anak</option>
                <option value="MENANTU">Menantu</option>
                <option value="CUCU">Cucu</option>
                <option value="ORANG_TUA">Orang Tua</option>
                <option value="MERTUA">Mertua</option>
                <option value="FAMILI_LAIN">Famili Lain</option>
                <option value="PEMBANTU">Pembantu</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <div>
              <label htmlFor="tempatLahir" className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tempatLahir"
                name="tempatLahir"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="tanggalLahir" className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggalLahir"
                name="tanggalLahir"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="agama" className="block text-sm font-medium text-gray-700 mb-2">
                Agama <span className="text-red-500">*</span>
              </label>
              <select
                id="agama"
                name="agama"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="ISLAM">Islam</option>
                <option value="KRISTEN">Kristen</option>
                <option value="KATOLIK">Katolik</option>
                <option value="HINDU">Hindu</option>
                <option value="BUDDHA">Buddha</option>
                <option value="KONGHUCU">Konghucu</option>
              </select>
            </div>

            <div>
              <label htmlFor="statusPerkawinan" className="block text-sm font-medium text-gray-700 mb-2">
                Status Perkawinan <span className="text-red-500">*</span>
              </label>
              <select
                id="statusPerkawinan"
                name="statusPerkawinan"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="BELUM_KAWIN">Belum Kawin</option>
                <option value="KAWIN">Kawin</option>
                <option value="CERAI_HIDUP">Cerai Hidup</option>
                <option value="CERAI_MATI">Cerai Mati</option>
              </select>
            </div>

            <div>
              <label htmlFor="pendidikan" className="block text-sm font-medium text-gray-700 mb-2">
                Pendidikan <span className="text-red-500">*</span>
              </label>
              <select
                id="pendidikan"
                name="pendidikan"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="TIDAK_SEKOLAH">Tidak/Belum Sekolah</option>
                <option value="BELUM_TAMAT_SD">Belum Tamat SD</option>
                <option value="SD">SD/Sederajat</option>
                <option value="SMP">SMP/Sederajat</option>
                <option value="SMA">SMA/Sederajat</option>
                <option value="DIPLOMA_I">Diploma I</option>
                <option value="DIPLOMA_II">Diploma II</option>
                <option value="DIPLOMA_III">Diploma III</option>
                <option value="DIPLOMA_IV_S1">Diploma IV/S1</option>
                <option value="S2">S2</option>
                <option value="S3">S3</option>
              </select>
            </div>

            <div>
              <label htmlFor="pekerjaan" className="block text-sm font-medium text-gray-700 mb-2">
                Pekerjaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pekerjaan"
                name="pekerjaan"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Contoh: Petani, Guru, Wiraswasta"
              />
            </div>

            <div>
              <label htmlFor="namaAyah" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Ayah
              </label>
              <input
                type="text"
                id="namaAyah"
                name="namaAyah"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="namaIbu" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Ibu
              </label>
              <input
                type="text"
                id="namaIbu"
                name="namaIbu"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="golonganDarah" className="block text-sm font-medium text-gray-700 mb-2">
                Golongan Darah
              </label>
              <select
                id="golonganDarah"
                name="golonganDarah"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Pilih</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>

            <div>
              <label htmlFor="kewarganegaraan" className="block text-sm font-medium text-gray-700 mb-2">
                Kewarganegaraan
              </label>
              <select
                id="kewarganegaraan"
                name="kewarganegaraan"
                defaultValue="WNI"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="WNI">WNI</option>
                <option value="WNA">WNA</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/penduduk"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
