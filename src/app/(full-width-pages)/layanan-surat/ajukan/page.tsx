import SubmitLetterRequestForm from "./SubmitLetterRequestForm"
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Ajukan Permohonan Surat | SID Mata Mamplam",
  description: "Formulir pengajuan permohonan surat online",
}

export default async function AjukanSuratPage({
  searchParams,
}: {
  searchParams: Promise<{ templateId?: string }>
}) {
  const session = await auth()
  // Public page - auth optional

  const params = await searchParams
  const templateId = params.templateId

  // Fetch templates for dropdown
  const templates = await prisma.letterTemplate.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })

  return (
    <SubmitLetterRequestForm 
      templates={templates} 
      initialTemplateId={templateId || ""}
      user={session?.user}
    />
  )
}
