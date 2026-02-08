import { prisma } from "@/lib/prisma"
import Link from "next/link"
import ExcelActions from "@/components/admin/ExcelActions"
import PendudukTable from "@/components/admin/penduduk/PendudukTable"

export default async function PendudukPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; dusun?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = 20
  const skip = (page - 1) * perPage

  // Build where clause
  const where: any = {}
  
  if (params.search) {
    where.OR = [
      { nik: { contains: params.search, mode: "insensitive" } },
      { nama: { contains: params.search, mode: "insensitive" } },
    ]
  }

  if (params.dusun) {
    where.kk = {
      OR: [
        // @ts-ignore
        { dusun: params.dusun },
        // Fallback for old data or if user used alamat field
        { alamat: { contains: params.dusun, mode: "insensitive" } }
      ]
    }
  }

  // Fetch data with pagination
  const [penduduk, totalCount] = await Promise.all([
    prisma.penduduk.findMany({
      where,
      include: {
        kk: {
          select: {
            noKK: true,
            // @ts-ignore
            dusun: true,
            alamat: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.penduduk.count({ where }),
  ])

  // Fetch stats separately to avoid connection exhaustion
  const totalPenduduk = totalCount > 0 ? await prisma.penduduk.count() : 0
  const kkCount = totalCount > 0 ? await prisma.kartuKeluarga.count() : 0

  // Serialize data for client component
  const serializedPenduduk = penduduk.map((p) => ({
    ...p,
    tanggalLahir: p.tanggalLahir.toISOString(),
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    kk: {
      ...p.kk,
      dusun: (p.kk as any).dusun || undefined,
    },
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Penduduk</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data penduduk Desa Mata Mamplam
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/penduduk/kk"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kartu Keluarga
          </Link>
          <Link
            href="/admin/penduduk/create"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Penduduk
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Penduduk</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalPenduduk.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kartu Keluarga</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {kkCount.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Excel Export/Import */}
      <ExcelActions type="penduduk" />

      {/* Search & Filter */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Cari NIK atau Nama..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="w-48">
            <select
              name="dusun"
              defaultValue={params.dusun}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
            >
              <option value="">Semua Dusun</option>
              <option value="Dusun Bale Situi">Dusun Bale Situi</option>
              <option value="Dusun Muda Intan">Dusun Muda Intan</option>
              <option value="Dusun Kolam">Dusun Kolam</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Filter
          </button>
          {(params.search || params.dusun) && (
            <Link
              href="/admin/penduduk"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </Link>
          )}
        </form>
      </div>

      {/* Table with bulk delete */}
      <PendudukTable
        penduduk={serializedPenduduk as any}
        totalCount={totalCount}
        currentPage={page}
        perPage={perPage}
        searchParams={params}
      />
    </div>
  )
}
