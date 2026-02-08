import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import UMKMForm from "@/components/admin/UMKMForm"

export default async function CreateUMKMPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const categories = await prisma.uMKMCategory.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah UMKM Baru</h1>
          <p className="mt-1 text-sm text-gray-600">
             Input data Usaha Mikro Kecil dan Menengah baru
          </p>
        </div>
      </div>

      <UMKMForm categories={categories} />
    </div>
  )
}
