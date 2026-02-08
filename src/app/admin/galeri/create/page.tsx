import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import GalleryForm from "@/components/admin/GalleryForm"

export default async function CreateGalleryPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const categories = await prisma.galleryCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Foto Galeri</h1>
          <p className="mt-1 text-sm text-gray-600">
             Upload dokumentasi kegiatan, potensi, atau fasilitas desa
          </p>
        </div>
      </div>

      <GalleryForm categories={categories} />
    </div>
  )
}
