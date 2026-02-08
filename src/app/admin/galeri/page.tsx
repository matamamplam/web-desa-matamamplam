import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"
import DeleteButton from "@/components/admin/DeleteButton"

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { page = "1", category } = await searchParams
  const currentPage = parseInt(page)
  const limit = 12
  const skip = (currentPage - 1) * limit

  const where: any = {}
  if (category && category !== "ALL") {
    // Need to find category ID from name/slug or just fetch category list to map
    // For simplicity, passing ID in URL or Name? 
    // Usually logic maps slug to ID. 
    // Let's assume URL param 'category' is the ID.
    // If user wants to filter by name, we need to fetch categories.
    // Let's fetch categories for filtering UI anyway.
    where.categoryId = category
  }

  const [items, total, categories] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      include: {
        category: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.galleryItem.count({ where }),
    prisma.galleryCategory.findMany()
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeri Desa</h1>
          <p className="mt-1 text-sm text-gray-600">
            Kumpulan foto kegiatan dan potensi desa
          </p>
        </div>
         <Link
          href="/admin/galeri/create"
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Foto
        </Link>
      </div>

       {/* Category Filter */}
       <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-200">
          <Link
            href="?"
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              !category || category === "ALL"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Semua
          </Link>
          {categories.map((cat) => (
             <Link
              key={cat.id}
              href={`?category=${cat.id}`}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                category === cat.id
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {items.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
               Belum ada foto di galeri.
            </div>
         ) : (
            items.map((item) => (
               <div key={item.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video relative bg-gray-100">
                     <Image
                       src={item.mediaUrl}
                       alt={item.title}
                       fill
                       className="object-cover"
                     />
                  </div>
                  <div className="p-4">
                     <div className="flex justify-between items-start mb-2">
                        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded">
                           {item.category.name}
                        </span>
                     </div>
                     <h3 className="text-sm font-medium text-gray-900 truncate" title={item.title}>
                        {item.title}
                     </h3>
                     <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {item.description || "Tidak ada deskripsi"}
                     </p>
                  </div>
                  
                  {/* Delete Overlay */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteButton 
                        id={item.id} 
                        apiEndpoint="/api/admin/gallery" 
                        btnClass="p-1 bg-red-600 text-white rounded shadow hover:bg-red-700" 
                        iconSize="h-4 w-4"
                      />
                  </div>
               </div>
            ))
         )}
      </div>

       {/* Pagination */}
       {totalPages > 1 && (
        <div className="flex justify-center mt-8">
           <div className="flex gap-1">
             {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                 key={i}
                 href={`?page=${i + 1}${category ? `&category=${category}` : ''}`}
                 className={`px-3 py-1 text-sm rounded-md ${
                   currentPage === i + 1
                     ? "bg-blue-600 text-white"
                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                 }`}
               >
                 {i + 1}
               </Link>
             ))}
           </div>
        </div>
      )}
    </div>
  )
}
