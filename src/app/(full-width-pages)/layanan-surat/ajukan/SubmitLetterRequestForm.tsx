"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  code: string
  name: string
  description: string | null
  isActive: boolean
}

interface Penduduk {
  id: string
  nik: string
  nama: string
}

interface SubmitLetterRequestFormProps {
  templates: Template[]
  initialTemplateId: string
  user: {
    name?: string | null
    email?: string | null
  }
}

export default function SubmitLetterRequestForm({
  templates,
  initialTemplateId,
  user,
}: SubmitLetterRequestFormProps) {
  const router = useRouter()
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId)
  const [nik, setNik] = useState("")
  const [pendudukData, setPendudukData] = useState<Penduduk | null>(null)
  const [purpose, setPurpose] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [nikError, setNikError] = useState("")
  const [isSearchingNik, setIsSearchingNik] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [formData, setFormData] = useState<Record<string, any>>({})

  // Reset form data when template changes
  useEffect(() => {
    setFormData({})
  }, [selectedTemplateId])

  // Search NIK
  const searchNik = useCallback(async () => {
    if (!nik || nik.length < 16) {
      setNikError("NIK harus 16 digit")
      setPendudukData(null)
      return
    }

    setIsSearchingNik(true)
    setNikError("")
    
    try {
      const res = await fetch(`/api/public/penduduk/check?nik=${nik}`)
      if (res.ok) {
        const data = await res.json()
        setPendudukData(data.penduduk)
        setNikError("")
      } else {
        setPendudukData(null)
        setNikError("NIK tidak ditemukan / belum terdata")
      }
    } catch (error) {
      console.error("Search NIK error:", error)
      setNikError("Terjadi kesalahan saat mencari NIK")
    } finally {
      setIsSearchingNik(false)
    }
  }, [nik])

  // Handle NIK change
  useEffect(() => {
    if (nik.length === 16) {
      searchNik()
    } else {
      setPendudukData(null)
      setNikError("")
    }
  }, [nik, searchNik])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTemplateId || !pendudukData || !purpose || !phoneNumber) {
      setError("Semua field wajib diisi")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/letter-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          pendudukId: pendudukData.id,
          purpose,
          phoneNumber: `0${phoneNumber}`, // Format to 08...
          formData, // Send additional dynamic data
        }),
      })

      if (res.ok) {
        // Success! Redirect to success page or show message
        alert("Permohonan surat berhasil diajukan!")
        router.push("/layanan-surat")
      } else {
        const data = await res.json()
        setError(data.message || "Gagal mengajukan permohonan")
      }
    } catch (error) {
      console.error("Submit error:", error)
      setError("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    selectedTemplateId &&
    pendudukData &&
    purpose.length >= 10 &&
    phoneNumber.length >= 9 && // Assuming min 9 digits for phone number after '0'
    !nikError &&
    !isSearchingNik &&
    !isLoading

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Ajukan Permohonan Surat</h1>
          <p className="mt-2 text-lg text-gray-600">
            Isi formulir di bawah ini untuk mengajukan surat
          </p>
        </div>

        {/* Form */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {error}
              </div>
            )}

            {/* Template Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Jenis Surat <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih jenis surat</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.code} - {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* NIK Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                NIK Pemohon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                placeholder="Masukkan 16 digit NIK"
                maxLength={16}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {isSearchingNik && (
                <p className="mt-2 text-sm text-blue-600">Mencari NIK...</p>
              )}
              {nikError && (
                <p className="mt-2 text-sm text-red-600">{nikError}</p>
              )}
              {pendudukData && (
                <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <p className="text-sm font-semibold text-green-900">
                    ✓ Data ditemukan
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    Nama: {pendudukData.nama}
                  </p>
                  <p className="text-sm text-green-800">NIK: {pendudukData.nik}</p>
                </div>
              )}
            </div>

            {/* WhatsApp Number Input */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative flex rounded-lg border border-gray-300 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
                <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm font-medium">
                  +62
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "")
                    if (value.startsWith("0")) {
                      value = value.substring(1)
                    }
                    setPhoneNumber(value)
                  }}
                  placeholder="8xxxxxxxxxx"
                  required
                  className="block w-full rounded-r-lg border-0 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Masukkan nomor tanpa angka 0 di depan (Contoh: 81234567890).
              </p>
            </div>

            {/* Purpose */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Tujuan/Keperluan Surat <span className="text-red-500">*</span>
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Jelaskan tujuan atau keperluan surat (contoh: Untuk keperluan pendaftaran sekolah)"
                rows={5}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimal 10 karakter
              </p>
            </div>

            {/* Dynamic Fields based on Template */}
            {(() => {
              const template = templates.find(t => t.id === selectedTemplateId)
              if (!template) return null

              // SKDU - Surat Keterangan Domisili Usaha
              if (template.code === "SKDU") {
                return (
                  <div className="mb-6 space-y-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                    <h3 className="font-semibold text-indigo-900">Informasi Usaha</h3>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Nama Usaha</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Contoh: Warung Kopi Sejahtera"
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, nama_usaha: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Jenis Usaha</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Contoh: Perdagangan / Jasa"
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, jenis_usaha: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Alamat Usaha</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Alamat lengkap lokasi usaha"
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, alamat_usaha: e.target.value }))}
                      />
                    </div>
                  </div>
                )
              }

              // SKP - Surat Keterangan Penghasilan
              if (template.code === "SKP" || template.code === "SKTM") {
                return (
                  <div className="mb-6 space-y-4 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                    <h3 className="font-semibold text-indigo-900">Informasi Tambahan</h3>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        {template.code === "SKP" ? "Jumlah Penghasilan (Rp)" : "Rata-rata Penghasilan (Rp)"}
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Contoh: 1500000"
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, penghasilan: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">Pekerjaan / Sumber Penghasilan</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                        placeholder="Contoh: Buruh Tani / Dagang"
                        onChange={(e) => setFormData((prev: any) => ({ ...prev, sumber_penghasilan: e.target.value }))}
                      />
                    </div>
                  </div>
                )
              }

              return null
            })()}

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading || !pendudukData || !selectedTemplateId || !purpose || !phoneNumber}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Mengirim..." : "Ajukan Permohonan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
