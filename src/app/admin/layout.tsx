import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <AdminLayoutClient>
      {/* Sidebar */}
      <Sidebar user={session.user} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header user={session.user} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8 flex flex-col">
          <div className="flex-1">{children}</div>
          <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
             &copy; {new Date().getFullYear()} Desa Mata Mamplam. All rights reserved.
          </footer>
        </main>
      </div>
    </AdminLayoutClient>
  )
}
