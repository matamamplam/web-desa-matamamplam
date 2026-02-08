import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate, calculateAge } from "@/lib/utils"

export default async function KKDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const kk = await prisma.kartuKeluarga.findUnique({
    where: { id },
    include: {
      anggota: {
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!kk) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Kartu Keluarga</h1>
          <p className="mt-1 text-sm text-gray-600">
            No. KK: {kk.noKK}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/penduduk/kk"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
          <Link
            href={`/admin/penduduk/kk/${kk.id}/edit`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit KK
          </Link>
        </div>
      </div>

      {/* KK Info Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kartu Keluarga</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Nomor KK</p>
            <p className="mt-1 font-mono font-medium text-gray-900">{kk.noKK}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kepala Keluarga</p>
            <p className="mt-1 font-medium text-gray-900">{kk.kepalaKeluarga}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Alamat</p>
            <p className="mt-1 text-gray-900">{kk.alamat}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">RT / RW</p>
            <p className="mt-1 font-medium text-gray-900">{kk.rt} / {kk.rw}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kelurahan/Desa</p>
            <p className="mt-1 text-gray-900">{kk.kelurahan}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kecamatan</p>
            <p className="mt-1 text-gray-900">{kk.kecamatan}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Kabupaten/Kota</p>
            <p className="mt-1 text-gray-900">{kk.kabupaten}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Provinsi</p>
            <p className="mt-1 text-gray-900">{kk.provinsi}</p>
          </div>
          {kk.kodePos && (
            <div>
              <p className="text-sm text-gray-600">Kode Pos</p>
              <p className="mt-1 text-gray-900">{kk.kodePos}</p>
            </div>
          )}
        </div>
      </div>

      {/* Anggota Keluarga */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Anggota Keluarga</h2>
            <p className="mt-1 text-sm text-gray-600">
              Total: {kk.anggota.length} orang
            </p>
          </div>
          <Link
            href={`/admin/penduduk/create?kkId=${kk.id}`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Anggota
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Hub. Keluarga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  L/P
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Umur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pekerjaan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {kk.anggota.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    Belum ada anggota keluarga
                  </td>
                </tr>
              ) : (
                kk.anggota.map((anggota) => (
                  <tr key={anggota.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono text-gray-900">
                      {anggota.nik}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {anggota.nama}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {anggota.hubunganDalamKeluarga.replace(/_/g, " ")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {anggota.jenisKelamin === "LAKI_LAKI" ? "L" : "P"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {calculateAge(anggota.tanggalLahir)} tahun
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {anggota.pekerjaan}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/penduduk/${anggota.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
