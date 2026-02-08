import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import UMKMForm from "@/components/admin/UMKMForm"

export default async function EditUMKMPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const [umkm, categories] = await Promise.all([
    prisma.uMKM.findUnique({
      where: { id },
    }),
    prisma.uMKMCategory.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!umkm) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Data UMKM</h1>
          <p className="mt-1 text-sm text-gray-600">
            Perbarui informasi usaha
          </p>
        </div>
      </div>

      <UMKMForm initialData={umkm} categories={categories} />
    </div>
  )
}
