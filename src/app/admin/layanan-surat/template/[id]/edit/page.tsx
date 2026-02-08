import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import EditTemplateForm from "./EditTemplateForm"

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const template = await prisma.letterTemplate.findUnique({
    where: { id },
  })

  if (!template) {
    notFound()
  }

  return <EditTemplateForm template={template} />
}
