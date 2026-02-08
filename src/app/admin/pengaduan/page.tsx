import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { formatDate } from "@/lib/utils"
// Reuse generic DeleteButton if possible, or create custom if needed later. Generic works for ID-based delete.
import DeleteButton from "@/components/admin/DeleteButton"

export default async function ComplaintsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { page = "1", search, status } = await searchParams
  const currentPage = parseInt(page)
  const limit = 10
  const skip = (currentPage - 1) * limit

  const where: any = {}
  if (search) {
     where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
  }
  if (status && status !== "ALL") {
    where.status = status
  }

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where,
      include: {
        category: { select: { name: true } },
        penduduk: { select: { nama: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.complaint.count({ where })
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Pengaduan</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kelola laporan dan pengaduan masyarakat
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {["ALL", "SUBMITTED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((s) => (
            <Link
              key={s}
              href={`?status=${s}`}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                ${(status === s || (!status && s === "ALL"))
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}
              `}
            >
              {s === "ALL" ? "Semua" : s.replace("_", " ")}
            </Link>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Judul & Lokasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kategori</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Pelapor</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tanggal</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  Belum ada pengaduan.
                </td>
              </tr>
            ) : (
              complaints.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.location || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {item.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.penduduk?.nama || "Anonim"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.status === "RESOLVED"
                        ? "bg-green-100 text-green-800"
                        : item.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "CLOSED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {item.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                       <Link
                        href={`/admin/pengaduan/${item.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detail
                      </Link>
                      <DeleteButton 
                        id={item.id} 
                        apiEndpoint="/api/admin/complaints" 
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
           {/* Simple pagination similar to other pages */}
           <div className="flex flex-1 justify-between sm:hidden">
              <Link href={`?page=${currentPage - 1}`} className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1 ? 'hidden' : ''}`}>Previous</Link>
              <Link href={`?page=${currentPage + 1}`} className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage >= totalPages ? 'hidden' : ''}`}>Next</Link>
           </div>
           <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-end">
               <span className="text-sm text-gray-700 mr-4">Page {currentPage} of {totalPages}</span>
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
