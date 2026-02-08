import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "Galeri Desa - Web Desa Mata Mamplam",
  description: "Dokumentasi kegiatan dan potensi Desa Mata Mamplam",
}

export default async function PublicGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  
  const where: any = {}
  if (category && category !== "ALL") {
    // Assuming filters by ID for simplicity as per admin page
    where.categoryId = category
  }

  const [items, categories] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      include: {
        category: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.galleryCategory.findMany()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Galeri Desa</h1>
        <p className="mt-4 text-lg text-gray-600">
          Potret kegiatan, keindahan alam, dan kemajuan Desa Mata Mamplam
        </p>
      </div>

      {/* Filter Categories */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/galeri"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !category
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Semua
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/galeri?category=${cat.id}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Belum ada foto yang ditampilkan untuk kategori ini.
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative w-full">
                 <Image
                   src={item.mediaUrl}
                   alt={item.title}
                   width={600}
                   height={400}
                   className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 />
                 
                 {/* Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="inline-block px-2 py-1 mb-2 text-xs font-semibold text-white bg-blue-600 rounded-md w-fit">
                       {item.category.name}
                    </span>
                    <h3 className="text-white font-bold text-lg leading-tight mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-200 text-sm line-clamp-2">{item.description}</p>
                    )}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
