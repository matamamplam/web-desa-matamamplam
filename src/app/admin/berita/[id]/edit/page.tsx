import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import NewsForm from "@/components/admin/NewsForm"

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const [news, categories] = await Promise.all([
    prisma.news.findUnique({
      where: { id },
    }),
    prisma.newsCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!news) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Berita</h1>
          <p className="mt-1 text-sm text-gray-600">
            Perbarui konten berita atau artikel.
          </p>
        </div>
      </div>

      <NewsForm initialData={news} categories={categories} />
    </div>
  )
}
