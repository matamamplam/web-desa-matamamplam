"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AgeDistributionChart from "@/components/admin/charts/AgeDistributionChart"
import GenderChart from "@/components/admin/charts/GenderChart"
import EducationChart from "@/components/admin/charts/EducationChart"
import OccupationChart from "@/components/admin/charts/OccupationChart"
import ReligionChart from "@/components/admin/charts/ReligionChart"
import MaritalStatusChart from "@/components/admin/charts/MaritalStatusChart"
import RTRWChart from "@/components/admin/charts/RTRWChart"
import PopulationTrendChart from "@/components/admin/charts/PopulationTrendChart"

interface StatisticsData {
  totalPopulation: number
  productiveAge: number
  children: number
  elderly: number
  ageDistribution: Array<{ range: string; count: number }>
  genderDistribution: Array<{ label: string; value: number }>
  educationDistribution: Array<{ label: string; value: number }>
  occupationDistribution: Array<{ label: string; value: number }>
  religionDistribution: Array<{ label: string; value: number }>
  maritalStatusDistribution: Array<{ label: string; value: number }>
  rtRwDistribution: Array<{ label: string; value: number }>
  monthlyTrend: Array<{ month: string; count: number }>
}

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/statistics/penduduk")
        if (!response.ok) throw new Error("Failed to fetch statistics")
        
        const result = await response.json()
        setData(result)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {error || "Gagal memuat data statistik"}
          </p>
          <div className="mt-4">
            <Link
              href="/admin/penduduk"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              &larr; Kembali ke Data Penduduk
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/dashboard" className="hover:text-gray-900">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/penduduk" className="hover:text-gray-900">Kependudukan</Link>
            <span>/</span>
            <span className="text-gray-900">Statistik</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Statistik Kependudukan</h1>
          <p className="mt-1 text-sm text-gray-600">
            Analisis data demografi penduduk Desa Mata Mamplam
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Penduduk</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalPopulation.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2 text-green-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usia Produktif</p>
              <p className="text-2xl font-bold text-gray-900">{data.productiveAge.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Anak-anak</p>
              <p className="text-2xl font-bold text-gray-900">{data.children.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2 text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lansia</p>
              <p className="text-2xl font-bold text-gray-900">{data.elderly.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Population Trend & Age Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tren Pertumbuhan Penduduk</h2>
          <div className="h-80">
            <PopulationTrendChart data={data.monthlyTrend} />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Distribusi Usia</h2>
          <div className="h-80">
            <AgeDistributionChart data={data.ageDistribution} />
          </div>
        </div>
      </div>

      {/* Row 2: Gender & Education */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Komposisi Jenis Kelamin</h2>
          <div className="h-80">
            <GenderChart data={data.genderDistribution} />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Tingkat Pendidikan</h2>
          <div className="h-80">
            <EducationChart data={data.educationDistribution} />
          </div>
        </div>
      </div>

      {/* Row 3: Religion & Marital Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Pemeluk Agama</h2>
          <div className="h-80">
            <ReligionChart data={data.religionDistribution} />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Status Perkawinan</h2>
          <div className="h-80">
            <MaritalStatusChart data={data.maritalStatusDistribution} />
          </div>
        </div>
      </div>

      {/* Row 4: Occupation & RT/RW Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">10 Pekerjaan Terbanyak</h2>
          <div className="h-80">
            <OccupationChart data={data.occupationDistribution} />
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Kepadatan per RT/RW</h2>
          <div className="h-80">
            <RTRWChart data={data.rtRwDistribution} />
          </div>
        </div>
      </div>
    </div>
  )
}
