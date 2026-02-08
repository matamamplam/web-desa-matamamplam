"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Penduduk {
  id: string
  nik: string
  nama: string
  jenisKelamin: string
  tempatLahir: string
  tanggalLahir: string
  agama: string
  pendidikan: string
  pekerjaan: string
  statusPerkawinan: string
  hubunganDalamKeluarga: string
  namaAyah: string | null
  namaIbu: string | null
  golonganDarah: string | null
  kewarganegaraan: string
  nomorPaspor: string | null
  nomorKITAS: string | null
  kk: {
    id: string
    noKK: string
    kepalaKeluarga: string
  }
}

export default function EditPendudukPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [penduduk, setPenduduk] = useState<Penduduk | null>(null)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
      fetchPenduduk(p.id)
    })
  }, [params])

  const fetchPenduduk = async (pendudukId: string) => {
    try {
      const res = await fetch(`/api/admin/penduduk/${pendudukId}`)
      if (res.ok) {
        const data = await res.json()
        setPenduduk(data)
      } else {
        setError("Data penduduk tidak ditemukan")
      }
    } catch (err) {
      setError("Gagal memuat data")
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
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
      const res = await fetch(`/api/admin/penduduk/${id}`, {
        method: "PUT",
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

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    )
  }

  if (!penduduk) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "Data tidak ditemukan"}</p>
          <Link href="/admin/penduduk" className="mt-4 inline-block text-blue-600 hover:underline">
            Kembali ke Daftar Penduduk
          </Link>
        </div>
      </div>
    )
  }

  // Format date for input
  const formattedDate = new Date(penduduk.tanggalLahir).toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Data Penduduk</h1>
          <p className="mt-1 text-sm text-gray-600">
            NIK: {penduduk.nik}
          </p>
        </div>
        <Link
          href="/admin/penduduk"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Batal
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
          {/* KK Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Kartu Keluarga</h3>
            <p className="text-sm text-gray-600">
              No. KK: <span className="font-mono font-medium">{penduduk.kk.noKK}</span> - {penduduk.kk.kepalaKeluarga}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              <Link href={`/admin/penduduk/kk/${penduduk.kk.id}`} className="text-blue-600 hover:underline">
                Lihat Detail KK →
              </Link>
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK
              </label>
              <input
                type="text"
                value={penduduk.nik}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500 cursor-not-allowed font-mono"
              />
              <p className="mt-1 text-xs text-gray-500">NIK tidak dapat diubah</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                defaultValue={penduduk.nama}
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
                defaultValue={penduduk.jenisKelamin}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
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
                defaultValue={penduduk.hubunganDalamKeluarga}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
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
                defaultValue={penduduk.tempatLahir}
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
                defaultValue={formattedDate}
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
                defaultValue={penduduk.agama}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
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
                defaultValue={penduduk.statusPerkawinan}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
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
                defaultValue={penduduk.pendidikan}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
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
                defaultValue={penduduk.pekerjaan}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
                defaultValue={penduduk.namaAyah || ""}
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
                defaultValue={penduduk.namaIbu || ""}
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
                defaultValue={penduduk.golonganDarah || ""}
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
                defaultValue={penduduk.kewarganegaraan}
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
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
