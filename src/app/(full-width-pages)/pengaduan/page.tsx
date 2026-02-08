import { prisma } from "@/lib/prisma"
import ComplaintForm from "@/components/public/ComplaintForm"

export const metadata = {
  title: "Layanan Pengaduan - Web Desa Mata Mamplam",
  description: "Sampaikan aspirasi dan keluhan Anda untuk kemajuan desa.",
}

// Revalidate every minute to ensure new categories appear fairly quickly
export const revalidate = 60 

export default async function PublicComplaintsPage() {
  // Fetch categories directly from DB (Server Component)
  const categories = await prisma.complaintCategory.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <div className="container mx-auto px-4 py-8">
       <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Layanan Pengaduan</h1>
            <p className="mt-4 text-lg text-gray-600">
              Sampaikan aspirasi, keluhan, atau saran Anda untuk kemajuan Desa Mata Mamplam. Identitas pelapor akan dijaga kerahasiaannya.
            </p>
          </div>

          <ComplaintForm categories={categories} />
       </div>
    </div>
  )
}
