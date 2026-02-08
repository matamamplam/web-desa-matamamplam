import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteButton from "@/components/admin/DeleteButton"
import { redirect } from "next/navigation"

export default async function LetterTemplatesPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const templates = await prisma.letterTemplate.findMany({
    include: {
      _count: {
        select: { requests: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  async function toggleActive(formData: FormData) {
    "use server"
    const id = formData.get("id") as string
    const isActive = formData.get("isActive") === "true"

    await prisma.letterTemplate.update({
      where: { id },
      data: { isActive: !isActive },
    })

    redirect("/admin/layanan-surat/template")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
<h1 className="text-2xl font-bold text-gray-900">Template Surat</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola template surat keterangan desa
          </p>
        </div>
        <Link
          href="/admin/layanan-surat/template/create"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Template
        </Link>
      </div>

      {/* Templates Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Kode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Nama Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Deskripsi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Permohonan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {templates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Belum ada template. Klik &quot;Tambah Template&quot; untuk membuat template baru.
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr key={template.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      {template.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm text-gray-500">
                      {template.description || "-"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {template._count.requests}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={template.id} />
                      <input type="hidden" name="isActive" value={template.isActive.toString()} />
                      <button
                        type="submit"
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          template.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {template.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </form>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/layanan-surat/template/${template.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      {template._count.requests === 0 && (
                        <DeleteButton
                          id={template.id}
                          apiEndpoint="/api/admin/letter-templates"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Placeholder yang tersedia:</h3>
            <div className="mt-2 text-sm text-blue-700">
              <code className="rounded bg-blue-100 px-1">{"{{nama}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{nik}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{tempatLahir}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{tanggalLahir}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{jenisKelamin}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{agama}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{pekerjaan}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{alamat}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{rt}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{rw}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{tujuan}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{nomorSurat}}"}</code>,{" "}
              <code className="rounded bg-blue-100 px-1">{"{{tanggalSurat}}"}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
