"use client"

import { useEffect, useState } from "react"
import GenderChart from "../charts/GenderChart"
import AgeDistributionChart from "../charts/AgeDistributionChart"
import EducationChart from "../charts/EducationChart"
import OccupationChart from "../charts/OccupationChart"

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

interface StatsDashboardProps {
  data: StatisticsData
}

export default function StatsDashboard({ data }: StatsDashboardProps) {


  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
          <p className="text-sm font-medium text-blue-900">Usia Produktif</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">
            {data.productiveAge.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-blue-700">15-64 tahun</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-green-100 p-4">
          <p className="text-sm font-medium text-green-900">Anak-anak</p>
          <p className="mt-2 text-2xl font-bold text-green-900">
            {data.children.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-green-700">0-14 tahun</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
          <p className="text-sm font-medium text-purple-900">Lansia</p>
          <p className="mt-2 text-2xl font-bold text-purple-900">
            {data.elderly.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-purple-700">65+ tahun</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4">
          <p className="text-sm font-medium text-orange-900">Total Penduduk</p>
          <p className="mt-2 text-2xl font-bold text-orange-900">
            {data.totalPopulation.toLocaleString("id-ID")}
          </p>
          <p className="mt-1 text-xs text-orange-700">Jiwa</p>
        </div>
      </div>

      {/* Charts Grid  */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Age Distribution */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="mb-4 font-semibold text-gray-900">Distribusi Usia</h4>
          <div className="h-64">
            <AgeDistributionChart data={data.ageDistribution} />
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="mb-4 font-semibold text-gray-900">Jenis Kelamin</h4>
          <div className="h-64">
            <GenderChart data={data.genderDistribution} />
          </div>
        </div>

        {/* Education Level */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="mb-4 font-semibold text-gray-900">Tingkat Pendidikan</h4>
          <div className="h-64">
            <EducationChart data={data.educationDistribution} />
          </div>
        </div>

        {/* Top Occupations */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h4 className="mb-4 font-semibold text-gray-900">10 Pekerjaan Teratas</h4>
          <div className="h-64">
            <OccupationChart data={data.occupationDistribution} />
          </div>
        </div>
      </div>
    </div>
  )
}
