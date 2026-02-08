"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface EditTemplateFormProps {
  template: {
    id: string
    code: string
    name: string
    description: string | null
    template: string
    isActive: boolean
  }
}

export default function EditTemplateForm({ template }: EditTemplateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: template.name,
    description: template.description || "",
    template: template.template,
    isActive: template.isActive,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/letter-templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update template")
      }

      router.push("/admin/layanan-surat/template")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const insertPlaceholder = (placeholder: string) => {
    setFormData((prev) => ({
      ...prev,
      template: prev.template + placeholder,
    }))
  }

  const placeholders = [
    { key: "{{nama}}", desc: "Nama lengkap" },
    { key: "{{nik}}", desc: "NIK" },
    { key: "{{tempatLahir}}", desc: "Tempat lahir" },
    { key: "{{tanggalLahir}}", desc: "Tanggal lahir" },
    { key: "{{jenisKelamin}}", desc: "Jenis kelamin" },
    { key: "{{agama}}", desc: "Agama" },
    { key: "{{pekerjaan}}", desc: "Pekerjaan" },
    { key: "{{alamat}}", desc: "Alamat lengkap" },
    { key: "{{rt}}", desc: "RT" },
    { key: "{{rw}}", desc: "RW" },
    { key: "{{tujuan}}", desc: "Tujuan surat" },
    { key: "{{nomorSurat}}", desc: "Nomor surat" },
    { key: "{{tanggalSurat}}", desc: "Tanggal surat" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Template Surat</h1>
          <p className="mt-1 text-sm text-gray-600">
            Edit template <span className="font-semibold">{template.code}</span>
          </p>
        </div>
        <Link
          href="/admin/layanan-surat/template"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Kembali
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Template
              </label>
              <div className="mt-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2">
                <span className="text-sm font-semibold text-gray-900">{template.code}</span>
                <span className="ml-2 text-xs text-gray-500">(tidak dapat diubah)</span>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Template <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700">
                Konten Template <span className="text-red-500">*</span>
              </label>
              <textarea
                id="template"
                rows={16}
                required
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Template aktif
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <Link
                href="/admin/layanan-surat/template"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </Link>
            </div>
          </form>
        </div>

        {/* Placeholders Helper */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Placeholder Tersedia</h3>
            <p className="mb-3 text-xs text-gray-600">Klik untuk menambahkan ke template</p>
            <div className="space-y-2">
              {placeholders.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => insertPlaceholder(p.key)}
                  className="flex w-full items-center justify-between rounded border border-gray-200 px-3 py-2 text-left text-xs hover:bg-gray-50"
                >
                  <code className="font-mono text-blue-600">{p.key}</code>
                  <span className="text-gray-500">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
