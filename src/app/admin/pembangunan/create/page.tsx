import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import ProjectForm from "@/components/admin/ProjectForm"

export default async function CreateProjectPage() {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tambah Proyek Baru</h1>
          <p className="mt-1 text-sm text-gray-600">
             Input data pembangunan desa baru
          </p>
        </div>
      </div>

      <ProjectForm />
    </div>
  )
}
