
import { prisma } from "@/lib/prisma"
import { HouseDataClient } from "@/components/admin/rumah/HouseDataClient"

export const dynamic = "force-dynamic"

export default async function HouseDataPage() {
  const houses = await prisma.kartuKeluarga.findMany({
    select: {
        id: true,
        noKK: true,
        kepalaKeluarga: true,
        alamat: true,
        dusun: true,
        jenisRumah: true
    },
    orderBy: { noKK: "asc" }
  })

  return (
    <div className="space-y-6">
       <HouseDataClient initialData={houses} />
    </div>
  )
}

