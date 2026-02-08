import { prisma } from "@/lib/prisma"
import { formatDate, formatRupiah } from "@/lib/utils"
// import Pagination from "@/components/ui/Pagination"; // If exists, otherwise manual
import Link from "next/link"
import Image from "next/image"

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: "Pembangunan Desa - Web Desa Mata Mamplam",
  description: "Informasi kegiatan pembangunan dan infrastruktur Desa Mata Mamplam",
}

export default async function PublicProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page = "1" } = await searchParams
  const currentPage = parseInt(page)
  const limit = 9
  const skip = (currentPage - 1) * limit

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      orderBy: { startDate: "desc" },
      skip,
      take: limit,
      where: {
        status: { not: "PLANNING" } // Helper to maybe hide planning? Or show all. Let's show all for transparency or filtered.
        // Let's show everything for now.
      }
    }),
    prisma.project.count({
      where: { status: { not: "PLANNING" } }
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Pembangunan Desa</h1>
        <p className="mt-4 text-lg text-gray-600">
          Transparansi kegiatan pembangunan dan infrastruktur di Desa Mata Mamplam
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Belum ada data pembangunan yang ditampilkan.
          </div>
        ) : (
          projects.map((item) => (
            <Link 
              key={item.id} 
              href={`/pembangunan/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                {item.photoAfter || item.photoBefore ? (
                  <Image
                    src={item.photoAfter || item.photoBefore || ""}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* Status Badge */}
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
                   item.status === "COMPLETED" 
                     ? "bg-green-100 text-green-800"
                     : item.status === "IN_PROGRESS"
                     ? "bg-blue-100 text-blue-800"
                     : "bg-gray-100 text-gray-800"
                }`}>
                  {item.status === "COMPLETED" ? "Selesai" : 
                   item.status === "IN_PROGRESS" ? "Dalam Pengerjaan" : 
                   item.status === "ON_HOLD" ? "Ditunda" : "Perencanaan"}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  {item.title}
                </h3>
                
                <div className="mb-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatRupiah(item.budget)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination (Simple) */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
           {Array.from({ length: totalPages }).map((_, i) => (
             <Link
               key={i}
               href={`?page=${i + 1}`}
               className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                 currentPage === i + 1
                   ? "bg-blue-600 text-white"
                   : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
               }`}
             >
               {i + 1}
             </Link>
           ))}
        </div>
      )}
    </div>
  )
}
