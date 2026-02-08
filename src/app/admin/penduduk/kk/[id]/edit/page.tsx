"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface KK {
  id: string
  noKK: string
  kepalaKeluarga: string
  alamat: string
  rt: string
  rw: string
  kodePos: string | null
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
}

export default function EditKKPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [kk, setKk] = useState<KK | null>(null)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
      fetchKK(p.id)
    })
  }, [params])

  const fetchKK = async (kkId: string) => {
    try {
      const res = await fetch(`/api/admin/kk/${kkId}`)
      if (res.ok) {
        const data = await res.json()
        setKk(data)
      } else {
        setError("KK tidak ditemukan")
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
      kepalaKeluarga: formData.get("kepalaKeluarga"),
      alamat: formData.get("alamat"),
      rt: formData.get("rt"),
      rw: formData.get("rw"),
      kodePos: formData.get("kodePos"),
      kelurahan: formData.get("kelurahan"),
      kecamatan: formData.get("kecamatan"),
      kabupaten: formData.get("kabupaten"),
      provinsi: formData.get("provinsi"),
    }

    try {
      const res = await fetch(`/api/admin/kk/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Gagal menyimpan data")
      }

      router.push(`/admin/penduduk/kk/${id}`)
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

  if (!kk) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || "KK tidak ditemukan"}</p>
          <Link href="/admin/penduduk/kk" className="mt-4 inline-block text-blue-600 hover:underline">
            Kembali ke Daftar KK
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Kartu Keluarga</h1>
          <p className="mt-1 text-sm text-gray-600">
            No. KK: {kk.noKK}
          </p>
        </div>
        <Link
          href={`/admin/penduduk/kk/${id}`}
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Kartu Keluarga
              </label>
              <input
                type="text"
                value={kk.noKK}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">No. KK tidak dapat diubah</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="kepalaKeluarga" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kepala Keluarga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kepalaKeluarga"
                name="kepalaKeluarga"
                required
                defaultValue={kk.kepalaKeluarga}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              id="alamat"
              name="alamat"
              required
              rows={3}
              defaultValue={kk.alamat}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label htmlFor="rt" className="block text-sm font-medium text-gray-700 mb-2">
                RT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="rt"
                name="rt"
                required
                maxLength={3}
                defaultValue={kk.rt}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="rw" className="block text-sm font-medium text-gray-700 mb-2">
                RW <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="rw"
                name="rw"
                required
                maxLength={3}
                defaultValue={kk.rw}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="kodePos" className="block text-sm font-medium text-gray-700 mb-2">
                Kode Pos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kodePos"
                name="kodePos"
                required
                maxLength={5}
                pattern="[0-9]{5}"
                defaultValue={kk.kodePos || ""}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="kelurahan" className="block text-sm font-medium text-gray-700 mb-2">
                Kelurahan/Desa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kelurahan"
                name="kelurahan"
                required
                defaultValue={kk.kelurahan}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="kecamatan" className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kecamatan"
                name="kecamatan"
                required
                defaultValue={kk.kecamatan}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="kabupaten" className="block text-sm font-medium text-gray-700 mb-2">
                Kabupaten/Kota <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kabupaten"
                name="kabupaten"
                required
                defaultValue={kk.kabupaten}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="provinsi" className="block text-sm font-medium text-gray-700 mb-2">
                Provinsi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="provinsi"
                name="provinsi"
                required
                defaultValue={kk.provinsi}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              href={`/admin/penduduk/kk/${id}`}
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
