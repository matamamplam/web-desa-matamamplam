import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const [pendingLetters, submittedComplaints, recentLetters, recentComplaints] = await Promise.all([
      prisma.letterRequest.count({
        where: { status: "PENDING" }
      }),
      prisma.complaint.count({
        where: { status: "SUBMITTED" }
      }),
      // Fetch recent letters detail
      prisma.letterRequest.findMany({
        where: { status: "PENDING" },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { 
          penduduk: { select: { nama: true } },
          template: { select: { name: true } }
        }
      }),
      // Fetch recent complaints detail
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
        time: l.createdAt,
        link: `/admin/layanan-surat/permohonan/${l.id}`
      })),
      ...recentComplaints.map(c => ({
        id: c.id,
        type: "COMPLAINT",
        title: `Pengaduan: ${c.title}`,
        subtitle: "Laporan Baru",
        time: c.createdAt,
        link: `/admin/pengaduan/${c.id}`
      }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

    return NextResponse.json({
      letters: pendingLetters,
      complaints: submittedComplaints,
      total: pendingLetters + submittedComplaints,
      recent: recentItems
    })

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch stats", error: error.message },
      { status: 500 }
    )
  }
}
