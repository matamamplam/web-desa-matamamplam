import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import StructureOrganizationClient from "@/components/admin/structure/StructureOrganizationClient"

export default async function StrukturOrganisasiPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/login")
  }

  // Fetch positions with officials
  const positions = await prisma.villageOfficialPosition.findMany({
    include: {
      official: true,
    },
    orderBy: [
      { level: "asc" },
      { sortOrder: "asc" },
    ],
  })

  // Normalize data to avoid JSON serialization issues with Dates if any
  // Prisma Dates are Date objects, which Next.js Server Components -> Client Components can handle if they are plain objects, 
  // but better to be safe or just pass them as they are since Next.js handles Date serialization automatically in recent versions.
  // However, explicit mapping ensures type safety for the client component interface.
  const serializedPositions = positions.map(p => ({
    ...p,
    official: p.official ? {
      ...p.official,
      startDate: p.official.startDate.toISOString(),
      endDate: p.official.endDate ? p.official.endDate.toISOString() : null,
      createdAt: p.official.createdAt.toISOString(),
      updatedAt: p.official.updatedAt.toISOString(),
    } : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return <StructureOrganizationClient initialPositions={serializedPositions} />
}
