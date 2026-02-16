import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/admin/Sidebar"
import Header from "@/components/admin/Header"
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"

import { prisma } from "@/lib/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  // Fetch critical notices for sidebar badges and header notifications
  const [pendingLetters, submittedComplaints, recentLetters, recentComplaints] = await Promise.all([
    prisma.letterRequest.count({ where: { status: "PENDING" } }),
    prisma.complaint.count({ where: { status: "SUBMITTED" } }),
    prisma.letterRequest.findMany({
      where: { status: "PENDING" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { 
        penduduk: { select: { nama: true } },
        template: { select: { name: true } }
      }
    }),
    prisma.complaint.findMany({
      where: { status: "SUBMITTED" },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, createdAt: true }
    })
  ])

  // Normalize and merge for "Recent Activity" feed
  const recentItems = [
    ...recentLetters.map(l => ({
      id: l.id,
      type: "LETTER",
      title: `Surat: ${l.template.name}`,
      subtitle: l.penduduk.nama,
      time: l.createdAt.toISOString(),
      link: `/admin/layanan-surat/permohonan/${l.id}`
    })),
    ...recentComplaints.map(c => ({
      id: c.id,
      type: "COMPLAINT",
      title: `Pengaduan: ${c.title}`,
      subtitle: "Laporan Baru",
      time: c.createdAt.toISOString(),
      link: `/admin/pengaduan/${c.id}`
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
  
  const sidebarStats = {
    letters: pendingLetters,
    complaints: submittedComplaints,
    total: pendingLetters + submittedComplaints,
    recent: recentItems
  }

  return (
    <AdminLayoutClient>
      {/* Sidebar */}
      <Sidebar user={session.user} stats={sidebarStats} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header user={session.user} stats={sidebarStats} />

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
