import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import NewsForm from "@/components/admin/NewsForm"

export default async function CreateNewsPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const categories = await prisma.newsCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Berita Baru</h1>
          <p className="mt-1 text-sm text-gray-600">
             Tulis artikel, berita, atau pengumuman baru untuk website desa.
          </p>
        </div>
      </div>

      <NewsForm categories={categories} />
    </div>
  )
}
