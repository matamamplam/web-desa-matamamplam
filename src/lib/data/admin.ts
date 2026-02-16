import { prisma } from "@/lib/prisma"
import { cache } from "react"

export const getAdminDashboardStats = cache(async () => {
  // Stats for Header & Sidebar badges
  const pendingLetters = await prisma.letterRequest.count({
    where: { status: "PENDING" },
  })

  const submittedComplaints = await prisma.complaint.count({
    where: { status: "SUBMITTED" }
  })

  // Recent Activity Feed
  const recentLetters = await prisma.letterRequest.findMany({
    where: { status: "PENDING" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { 
      penduduk: { select: { nama: true } },
      template: { select: { name: true } }
    }
  })

  const recentComplaints = await prisma.complaint.findMany({
    where: { status: "SUBMITTED" },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true }
  })

   // Normalize and merge for "Recent Activity" feed
  const recentItems = [
    ...recentLetters.map(l => ({
      id: l.id,
      type: "LETTER" as const,
      title: `Surat: ${l.template.name}`,
      subtitle: l.penduduk.nama,
      time: l.createdAt.toISOString(),
      link: `/admin/layanan-surat/permohonan/${l.id}`
    })),
    ...recentComplaints.map(c => ({
      id: c.id,
      type: "COMPLAINT" as const,
      title: `Pengaduan: ${c.title}`,
      subtitle: "Laporan Baru",
      time: c.createdAt.toISOString(),
      link: `/admin/pengaduan/${c.id}`
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

  return {
    counts: {
        pendingLetters,
        submittedComplaints
    },
    recentActivity: recentItems
  }
})

export const getAdminSummaryStats = cache(async () => {
    const totalPenduduk = await prisma.penduduk.count()
    const totalKK = await prisma.kartuKeluarga.count()
    const totalLetterRequests = await prisma.letterRequest.count()
    const totalUMKM = await prisma.uMKM.count()
    const totalComplaints = await prisma.complaint.count()

    return {
        totalPenduduk,
        totalKK,
        totalLetterRequests,
        totalUMKM,
        totalComplaints
    }

})
