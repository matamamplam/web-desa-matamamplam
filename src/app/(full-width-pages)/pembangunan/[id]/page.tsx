import { prisma } from "@/lib/prisma"
import { formatDate, formatRupiah } from "@/lib/utils"
// import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
  })
  
  if (!project) return { title: "Proyek Tidak Ditemukan" }

  return {
    title: `${project.title} - Pembangunan Desa Mata Mamplam`,
    description: project.description.substring(0, 160),
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
  })

  // if (!project) notFound() // Handle manually or let Error Boundary catch.

  if (!project) {
     return (
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-bold">Proyek tidak ditemukan</h1>
            <Link href="/pembangunan" className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Daftar</Link>
        </div>
     )
  }

  // Parse gallery if it's JSON type
  let gallery: string[] = []
  if (Array.isArray(project.photoGallery)) {
      gallery = project.photoGallery as string[]
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">Beranda</Link>
        <span>/</span>
        <Link href="/pembangunan" className="hover:text-blue-600">Pembangunan</Link>
        <span>/</span>
        <span className="truncate max-w-[200px] text-gray-900 font-medium">{project.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Hero Image */}
           <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-sm border border-gray-100">
              <div className="relative aspect-video w-full">
                  {project.photoAfter || project.photoBefore ? (
                    <Image
                        src={project.photoAfter || project.photoBefore || ""}
                        alt={project.title}
                        fill
                        className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400 bg-gray-50">
                        <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                  )}
              </div>
           </div>

           {/* Title & Description */}
           <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                 {project.description}
              </div>
           </div>
           
           {/* Comparison */}
           {(project.photoBefore && project.photoAfter) && (
              <div className="space-y-4 pt-6 border-t border-gray-100">
                 <h3 className="text-xl font-bold text-gray-900">Perbandingan (Sebelum vs Sesudah)</h3>
                 <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-center text-gray-500">Kondisi Awal (0%)</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <Image 
                                src={project.photoBefore} 
                                alt="Foto Sebelum" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-center text-gray-500">Kondisi Akhir (100%)</p>
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                            <Image 
                                src={project.photoAfter} 
                                alt="Foto Sesudah" 
                                fill 
                                className="object-cover"
                            />
                        </div>
                    </div>
                 </div>
              </div>
           )}

           {/* Gallery Grid */}
           {gallery.length > 0 && (
             <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Galeri Foto</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                   {gallery.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                         <Image
                            src={photo}
                            alt={`Galeri ${idx + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                         />
                      </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
           <div className="sticky top-24 space-y-6">
              
              {/* Status Card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                 <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Proyek</h3>
                 
                 <div className="space-y-4">
                    {/* Status */}
                    <div>
                       <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Status</label>
                       <div className="mt-1">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            project.status === "COMPLETED" 
                              ? "bg-green-100 text-green-800"
                              : project.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "ON_HOLD"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {project.status === "COMPLETED" ? "Selesai" : 
                             project.status === "IN_PROGRESS" ? "Dalam Pengerjaan" : 
                             project.status === "ON_HOLD" ? "Ditunda" : "Perencanaan"}
                          </span>
                       </div>
                    </div>

                    {/* Progress */}
                    <div>
                       <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Progress</label>
                          <span className="text-sm font-bold">{project.progress}%</span>
                       </div>
                       <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div 
                             className="h-full bg-blue-600"
                             style={{ width: `${project.progress}%` }}
                          />
                       </div>
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Location */}
                    <div className="flex gap-3">
                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Lokasi</p>
                          <p className="text-sm font-medium text-gray-900">{project.location}</p>
                       </div>
                    </div>

                    {/* Budget */}
                    <div className="flex gap-3">
                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Anggaran</p>
                          <p className="text-sm font-medium text-gray-900">{formatRupiah(project.budget)}</p>
                       </div>
                    </div>
                 
                    {/* Dates */}
                     <div className="flex gap-3">
                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Waktu Pelaksanaan</p>
                          <p className="text-sm font-medium text-gray-900">
                             {formatDate(project.startDate)} 
                             {project.endDate ? ` - ${formatDate(project.endDate)}` : " s/d Selesai"}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Contact/CTA */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                 <p className="text-sm text-blue-800">
                    Ada pertanyaan atau masukan terkait proyek ini? Silakan sampaikan melalui layanan pengaduan.
                 </p>
                 <Link 
                    href="/layanan-pengaduan"
                    className="mt-3 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                 >
                    Kirim Masukan
                 </Link>
              </div>

           </div>
        </div>
      </div>
    </div>
  )
}
