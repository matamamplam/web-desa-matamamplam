import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import StatsCards from "@/components/admin/dashboard/StatsCards"
import StatsDashboard from "@/components/admin/dashboard/StatsDashboard"
import Link from "next/link"
import {
  calculateAge,
  getAgeGroup,
  formatEnumValue,
  aggregateByField,
  getTopN,
  groupByAgeRanges,
  getLastNMonths,
} from "@/lib/statistics"
import { getAdminDashboardStats, getAdminSummaryStats } from "@/lib/data/admin"

async function getDemographicStats() {
  const penduduk = await prisma.penduduk.findMany({
    select: {
      tanggalLahir: true,
      jenisKelamin: true,
      agama: true,
      pendidikan: true,
      pekerjaan: true,
      statusPerkawinan: true,
      createdAt: true,
      kk: {
        select: {
          rt: true,
          rw: true,
        },
      },
    },
  })

  // Calculations
  const ageDistribution = groupByAgeRanges(penduduk.map((p) => p.tanggalLahir))
  const genderDistribution = aggregateByField(penduduk, "jenisKelamin", formatEnumValue)
  const educationDistribution = aggregateByField(penduduk, "pendidikan", formatEnumValue)
  const allOccupations = aggregateByField(penduduk, "pekerjaan")
  const occupationDistribution = getTopN(allOccupations, 10)
  const religionDistribution = aggregateByField(penduduk, "agama", formatEnumValue)
  const maritalStatusDistribution = aggregateByField(penduduk, "statusPerkawinan", formatEnumValue)
  
  const rtRwData = penduduk.map((p) => ({ rtRw: `RT ${p.kk.rt}/RW ${p.kk.rw}` }))
  const rtRwDistribution = getTopN(aggregateByField(rtRwData, "rtRw"), 10)

  const productiveAge = penduduk.filter((p) => {
    const age = calculateAge(p.tanggalLahir)
    return age >= 15 && age <= 64
  }).length

  const children = penduduk.filter((p) => {
    const age = calculateAge(p.tanggalLahir)
    return age < 15
  }).length

  const elderly = penduduk.filter((p) => {
    const age = calculateAge(p.tanggalLahir)
    return age >= 65
  }).length

  return {
    totalPopulation: penduduk.length,
    productiveAge,
    children,
    elderly,
    ageDistribution,
    genderDistribution,
    educationDistribution,
    occupationDistribution,
    religionDistribution,
    maritalStatusDistribution,
    rtRwDistribution,
    monthlyTrend: [], // Simplified for now or implement if needed
  }
}

export default async function AdminPage() {
  const session = await auth()
  
  const demographicStats = await getDemographicStats()

  // Fetch statistics using request memoization (shared with layout)
  const { counts, recentActivity } = await getAdminDashboardStats()
  const { totalPenduduk, totalKK, totalLetterRequests, totalUMKM, totalComplaints } = await getAdminSummaryStats()
  
  const pendingLetters = counts.pendingLetters
  const submittedComplaints = counts.submittedComplaints
  const recentActivities = recentActivity

  const stats = [
    {
      title: "Total Penduduk",
      value: totalPenduduk,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-blue-500",
      trend: "+5% dari bulan lalu",
    },
    {
      title: "Kartu Keluarga",
      value: totalKK,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: "bg-green-500",
    },
    {
      title: "Permohonan Surat",
      value: totalLetterRequests,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "bg-yellow-500",
      badge: pendingLetters > 0 ? `${pendingLetters} pending` : undefined,
    },
    {
      title: "UMKM Terdaftar",
      value: totalUMKM,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: "bg-purple-500",
    },
    {
      title: "Pengaduan",
      value: totalComplaints,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      color: "bg-red-500",
      badge: submittedComplaints > 0 ? `${submittedComplaints} baru` : undefined,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat Datang, {session?.user?.name}!
        </h1>
        <p className="mt-1 text-gray-600">
          Berikut adalah ringkasan data Sistem Informasi Desa Mata Mamplam
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Statistik Demografi Penduduk
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Visualisasi data penduduk berdasarkan berbagai kategori
            </p>
          </div>
          <Link
            href="/admin/penduduk/statistik"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Lihat Detail
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <StatsDashboard data={demographicStats} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Aksi Cepat
          </h3>
          <div className="mt-4 space-y-2">
            <a
              href="/admin/penduduk"
              className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              + Tambah Data Penduduk
            </a>
            <a
              href="/admin/berita/create"
              className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              + Buat Berita Baru
            </a>
            <a
              href="/admin/umkm"
              className="block rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              + Daftarkan UMKM
            </a>
          </div>
        </div>

        {/* Placeholder for recent activity */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Aktivitas Terbaru
          </h3>
          <div className="mt-4 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {recentActivities.length === 0 ? (
                <li className="py-5 text-sm text-gray-500">Belum ada aktivitas baru.</li>
              ) : (
                recentActivities.map((activity) => (
                  <li key={activity.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                         <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                           activity.type === 'LETTER' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                         }`}>
                           {activity.type === 'LETTER' ? (
                             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                             </svg>
                           ) : (
                             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                             </svg>
                           )}
                         </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {activity.subtitle}
                        </p>
                      </div>
                      <div>
                        <Link
                          href={activity.link}
                          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Lihat
                        </Link>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
