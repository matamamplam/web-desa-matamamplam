import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import DeleteButton from "@/components/admin/penduduk/DeleteButton"
import ExcelActions from "@/components/admin/ExcelActions"

export default async function KKPage({ searchParams }: { searchParams: Promise<{ search?: string; page?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = 20
  const skip = (page - 1) * perPage

  const where: any = {}
  if (params.search) {
    where.OR = [
      { noKK: { contains: params.search, mode: "insensitive" } },
      { kepalaKeluarga: { contains: params.search, mode: "insensitive" } },
      { alamat: { contains: params.search, mode: "insensitive" } },
    ]
  }

  const [kkList, totalCount] = await Promise.all([
    prisma.kartuKeluarga.findMany({
      where,
      include: {
        _count: {
          select: { anggota: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.kartuKeluarga.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kartu Keluarga</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data Kartu Keluarga (KK)
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/penduduk"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
          <Link
            href="/admin/penduduk/kk/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah KK
          </Link>
        </div>
      </div>

      {/* Excel Export/Import */}
      <ExcelActions type="kk" />

      {/* Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <form className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Cari No. KK, Kepala Keluarga, atau Alamat..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Cari
          </button>
          {params.search && (
            <Link
              href="/admin/penduduk/kk"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  No. KK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Kepala Keluarga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Alamat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  RT/RW
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Jumlah Anggota
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {kkList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Tidak ada data Kartu Keluarga
                  </td>
                </tr>
              ) : (
                kkList.map((kk) => (
                  <tr key={kk.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-mono font-medium text-gray-900">
                      {kk.noKK}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {kk.kepalaKeluarga}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {kk.alamat}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {kk.rt}/{kk.rw}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {kk._count.anggota} orang
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm space-x-3">
                      <Link
                        href={`/admin/penduduk/kk/${kk.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detail
                      </Link>
                      <Link
                        href={`/admin/penduduk/kk/${kk.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Link>
                      <DeleteButton 
                        id={kk.id} 
                        name={kk.noKK} 
                        type="kk" 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
            <div className="text-sm text-gray-700">
              Menampilkan <span className="font-medium">{skip + 1}</span> -{" "}
              <span className="font-medium">{Math.min(skip + perPage, totalCount)}</span> dari{" "}
              <span className="font-medium">{totalCount}</span> data
            </div>
            <div className="flex space-x-2">
              {page > 1 && (
                <Link
                  href={`?${new URLSearchParams({ ...params, page: String(page - 1) })}`}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`?${new URLSearchParams({ ...params, page: String(page + 1) })}`}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
