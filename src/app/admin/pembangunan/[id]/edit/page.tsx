import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import ProjectForm from "@/components/admin/ProjectForm"

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    notFound()
  }

  // Serialize BigInt for Client Component
  const serializableProject = {
    ...project,
    budget: project.budget.toString(),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Data Proyek</h1>
          <p className="mt-1 text-sm text-gray-600">
            Perbarui informasi pembangunan desa
          </p>
        </div>
      </div>

      <ProjectForm initialData={serializableProject} />
    </div>
  )
}
