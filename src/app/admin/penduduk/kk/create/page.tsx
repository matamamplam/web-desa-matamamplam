"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateKKPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      noKK: formData.get("noKK"),
      kepalaKeluarga: formData.get("kepalaKeluarga"),
      dusun: formData.get("alamat"), // Using alamat input as dusun
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
      const res = await fetch("/api/admin/kk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Gagal menyimpan data")
      }

      router.push("/admin/penduduk/kk")
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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Kartu Keluarga</h1>
          <p className="mt-1 text-sm text-gray-600">
            Masukkan data Kartu Keluarga baru
          </p>
        </div>
        <Link
          href="/admin/penduduk/kk"
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
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="noKK" className="block text-sm font-medium text-gray-700 mb-2">
                No. Kartu Keluarga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="noKK"
                name="noKK"
                required
                maxLength={16}
                pattern="[0-9]{16}"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="16 digit"
              />
              <p className="mt-1 text-xs text-gray-500">Contoh: 1234567890123456</p>
            </div>

            <div>
              <label htmlFor="kepalaKeluarga" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kepala Keluarga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kepalaKeluarga"
                name="kepalaKeluarga"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             <div className="md:col-span-2">
              <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat / Nama Dusun <span className="text-red-500">*</span>
              </label>
              <input
                list="dusun-options"
                id="alamat"
                name="alamat"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Contoh: Dusun Bale Situi"
              />
              <datalist id="dusun-options">
                  <option value="Dusun Bale Situi" />
                  <option value="Dusun Muda Intan" />
                  <option value="Dusun Kolam" />
              </datalist>
            </div>

            <div className="hidden">
               {/* Hidden field for separate dusun, if needed by backend, otherwise mapping alamat to dusun */}
               <input type="hidden" name="dusun" value="" />
            </div>

            <div>
              <label htmlFor="rt" className="block text-sm font-medium text-gray-700 mb-2">
                RT (Default 000)
              </label>
              <input
                type="text"
                id="rt"
                name="rt"
                required
                maxLength={3}
                defaultValue="000"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="rw" className="block text-sm font-medium text-gray-700 mb-2">
                RW (Default 000)
              </label>
              <input
                type="text"
                id="rw"
                name="rw"
                required
                maxLength={3}
                defaultValue="000"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
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
                defaultValue="24261"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            <div>
              <label htmlFor="kelurahan" className="block text-sm font-medium text-gray-700 mb-2">
                Gampong/Kelurahan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="kelurahan"
                name="kelurahan"
                required
                defaultValue="Mata Mamplam"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-50 text-gray-500"
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
                defaultValue="Peusangan"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
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
                defaultValue="Bireuen"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
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
                defaultValue="Aceh"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Link
              href="/admin/penduduk/kk"
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
