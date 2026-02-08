import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import DeleteButton from "@/components/admin/DeleteButton"

export default async function UMKMPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { page = "1", search } = await searchParams
  const currentPage = parseInt(page)
  const limit = 10
  const skip = (currentPage - 1) * limit

  const where: any = {}
  if (search) {
    where.name = { contains: search, mode: "insensitive" }
  }

  const [umkm, total] = await Promise.all([
    prisma.uMKM.findMany({
      where,
      include: {
        category: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.uMKM.count({ where })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data UMKM</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola data Usaha Mikro Kecil dan Menengah di desa
          </p>
        </div>
        <Link
          href="/admin/umkm/create"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah UMKM
        </Link>
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Usaha</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pemilik</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kontak</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {umkm.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Belum ada data UMKM.
                </td>
              </tr>
            ) : (
              umkm.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{item.address}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.ownerName}
                  </td>
                   <td className="px-6 py-4 text-sm text-gray-500">
                    {item.ownerPhone}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {item.isActive ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        href={`/admin/umkm/${item.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <DeleteButton 
                        id={item.id} 
                        apiEndpoint="/api/admin/umkm" 
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

       {/* Pagination */}
       {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Link
              href={`?page=${currentPage - 1}`}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
              Previous
            </Link>
            <Link
              href={`?page=${currentPage + 1}`}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
              Next
            </Link>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
             <p className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
             </p>
             <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                   <Link
                    key={i}
                    href={`?page=${i + 1}`}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-900 hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
