
import { prisma } from "@/lib/prisma"
import { BansosListClient } from "@/components/admin/bansos/BansosListClient"

export const dynamic = "force-dynamic"

export default async function BansosPage() {
  const bansosList = await prisma.bansos.findMany({
    include: {
        program: {
            select: {
                nama: true
            }
        },
        penerima: {
            select: {
                nama: true,
                nik: true
            }
        }
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
       <BansosListClient initialData={bansosList} />
    </div>
  )
}

