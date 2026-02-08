import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import ApprovalActions from "./ApprovalActions"

export default async function LetterRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) {
    redirect("/login")
  }

  const { id } = await params

  const request = await prisma.letterRequest.findUnique({
    where: { id },
    include: {
      template: true,
      penduduk: {
        include: {
          kk: true,
        },
      },
      approver: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!request) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    COMPLETED: "bg-gray-100 text-gray-800",
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Menunggu",
    PROCESSING: "Diproses",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
    COMPLETED: "Selesai",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Permohonan Surat</h1>
          <p className="mt-1 text-sm text-gray-600">
            {request.nomorSurat.startsWith("TEMP-") ? "Belum ada nomor surat" : `Nomor: ${request.nomorSurat}`}
          </p>
        </div>
        <Link
          href="/admin/layanan-surat/permohonan"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Kembali
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Request Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Informasi Permohonan</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[request.status]}`}>
                {statusLabels[request.status]}
              </span>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Jenis Surat</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.template.name}
                  <span className="ml-2 text-xs text-gray-500">({request.template.code})</span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Tujuan/Keperluan</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.purpose}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Tanggal Pengajuan</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(request.createdAt)}</dd>
              </div>

              {request.approvedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tanggal Disetujui</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(request.approvedAt)}</dd>
                </div>
              )}

              {request.approver && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Disetujui Oleh</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.approver.name}</dd>
                </div>
              )}

              {request.notes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Catatan</dt>
                  <dd className="mt-1 text-sm text-gray-900">{request.notes}</dd>
                </div>
              )}

              {request.verificationCode && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Kode Verifikasi</dt>
                  <dd className="mt-1 font-mono text-sm text-gray-900">{request.verificationCode}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Penduduk Info */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Data Pemohon</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">NIK</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.penduduk.nik}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.penduduk.nama}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Tempat/Tanggal Lahir</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.penduduk.tempatLahir}, {formatDate(request.penduduk.tanggalLahir)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.penduduk.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Agama</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.penduduk.agama}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Pekerjaan</dt>
                <dd className="mt-1 text-sm text-gray-900">{request.penduduk.pekerjaan}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.penduduk.kk.alamat}, RT {request.penduduk.kk.rt}/RW {request.penduduk.kk.rw}
                </dd>
              </div>
            </dl>
          </div>

          {/* Attachments */}
          {request.attachments && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Dokumen Lampiran</h2>
              <div className="space-y-2">
                {(request.attachments as any[]).map((attachment: any, index: number) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded border border-gray-200 p-3 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm text-blue-600">{attachment.name || `Lampiran ${index + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Approval Actions */}
        <div>
          <ApprovalActions request={request} />
        </div>
      </div>
    </div>
  )
}
