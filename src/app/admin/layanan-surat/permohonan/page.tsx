import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import StatusFilter from "@/components/admin/StatusFilter"
import DeleteButton from "@/components/admin/DeleteButton"

export default async function LetterRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const params = await searchParams
  const status = params.status
  const search = params.search
  const page = parseInt(params.page || "1")
  const perPage = 20
  const skip = (page - 1) * perPage

  const where: any = {}
  if (status && status !== "ALL") {
    where.status = status
  }

  if (search) {
    where.OR = [
      {
        penduduk: {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { nik: { contains: search, mode: "insensitive" } },
          ],
        },
      },
      { nomorSurat: { contains: search, mode: "insensitive" } },
    ]
  }

  const [requests, totalCount, templates] = await Promise.all([
    prisma.letterRequest.findMany({
      where,
      include: {
        template: {
          select: {
            code: true,
            name: true,
          },
        },
        penduduk: {
          select: {
            nik: true,
            nama: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: perPage,
    }),
    prisma.letterRequest.count({ where }),
    prisma.letterTemplate.findMany({
      select: { id: true, name: true, code: true },
      where: { isActive: true },
    }),
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  const statusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "PENDING", label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
    { value: "PROCESSING", label: "Diproses", color: "bg-blue-100 text-blue-800" },
    { value: "APPROVED", label: "Disetujui", color: "bg-green-100 text-green-800" },
    { value: "REJECTED", label: "Ditolak", color: "bg-red-100 text-red-800" },
    { value: "COMPLETED", label: "Selesai", color: "bg-gray-100 text-gray-800" },
  ]

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find((o) => o.value === status)
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${option?.color || "bg-gray-100 text-gray-800"}`}>
        {option?.label || status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Permohonan Surat</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola permohonan surat dari warga
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {statusOptions.slice(1).map((statusOpt) => {
          const count = requests.filter((r) => r.status === statusOpt.value).length
          return (
            <Link
              key={statusOpt.value}
              href={`/admin/layanan-surat/permohonan?status=${statusOpt.value}`}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm text-gray-600">{statusOpt.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{count}</p>
            </Link>
          )
        })}
      </div>

      {/* Filters */}
      <StatusFilter currentStatus={status} />

      {/* Requests Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Pemohon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Jenis Surat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tujuan
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
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Tidak ada permohonan surat.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.penduduk.nama}</div>
                    <div className="text-xs text-gray-500">{request.penduduk.nik}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{request.template.name}</div>
                    <div className="text-xs text-gray-500">{request.template.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-sm text-gray-500">
                      {request.purpose}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium flex justify-end items-center">
                    <Link
                      href={`/admin/layanan-surat/permohonan/${request.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Detail
                    </Link>
                    <DeleteButton id={request.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Menampilkan {skip + 1}-{Math.min(skip + perPage, totalCount)} dari {totalCount} permohonan
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?status=${status || "ALL"}&page=${page - 1}`}
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Sebelumnya
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?status=${status || "ALL"}&page=${page + 1}`}
                className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
              >
                Selanjutnya
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
