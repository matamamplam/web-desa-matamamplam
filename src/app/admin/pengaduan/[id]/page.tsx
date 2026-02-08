import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { formatDate, formatDateTime } from "@/lib/utils"
import Link from "next/link"
import ComplaintResponseForm from "@/components/admin/ComplaintResponseForm"

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      category: { select: { name: true } },
      penduduk: { 
        select: { 
          nama: true, 
          nik: true, 
          kk: { select: { alamat: true } } 
        } 
      },
      responder: { select: { name: true } }
    }
  })

  if (!complaint) {
    notFound()
  }

  // Helper for status badge (can also be a component)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED": return "bg-green-100 text-green-800"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "CLOSED": return "bg-gray-100 text-gray-800" // Used for closed/rejected
      default: return "bg-yellow-100 text-yellow-800" // SUBMITTED, IN_REVIEW
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Pengaduan</h1>
          <p className="mt-1 text-sm text-gray-600">
             #{complaint.id}
          </p>
        </div>
        <Link
          href="/admin/pengaduan"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
             {/* Info Box */}
             <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                   <h2 className="text-xl font-semibold text-gray-900">{complaint.title}</h2>
                   <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(complaint.status)}`}>
                      {complaint.status.replace("_", " ")}
                    </span>
                </div>
                
                <div className="mt-4 prose max-w-none text-gray-700">
                   <p className="whitespace-pre-wrap">{complaint.description}</p>
                </div>

                <div className="mt-6 border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <p className="text-gray-500">Kategori</p>
                      <p className="font-medium">{display(complaint, 'category', 'name')}</p>
                   </div>
                   <div>
                       <p className="text-gray-500">Lokasi</p>
                       <p className="font-medium">{complaint.location || "-"}</p>
                   </div>
                   <div>
                       <p className="text-gray-500">Tanggal Pengaduan</p>
                       <p className="font-medium">{formatDateTime(complaint.createdAt)}</p>
                   </div>
                </div>
             </div>

             {/* Response Section */}
             <ComplaintResponseForm 
               complaintId={complaint.id} 
               initialStatus={complaint.status} 
               initialResponse={complaint.response} 
             />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           {/* Reporter Info */}
           <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Informasi Pelapor</h3>
              {complaint.penduduk ? (
                 <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Nama</p>
                      <p className="font-medium">{complaint.penduduk.nama}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">NIK</p>
                      <p className="font-medium">{complaint.penduduk.nik}</p>
                    </div>
                     <div>
                      <p className="text-gray-500">Alamat</p>
                      <p className="font-medium">{complaint.penduduk.kk?.alamat || "-"}</p>
                    </div>
                 </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Laporan masuk sebagai anonim / tamu.</p>
              )}
           </div>

           {/* History / Status Metadata */}
           <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Riwayat Penanganan</h3>
              {complaint.responder ? (
                 <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Ditanggapi Oleh</p>
                      <p className="font-medium">{display(complaint, 'responder', 'name')}</p>
                    </div>
                     <div>
                      <p className="text-gray-500">Waktu Tanggapan</p>
                      <p className="font-medium">{complaint.respondedAt ? formatDateTime(complaint.respondedAt) : "-"}</p>
                    </div>
                 </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Belum ada tanggapan resmi.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

function display(obj: any, rel: string, field: string) {
  return obj[rel] ? obj[rel][field] : "-"
}

