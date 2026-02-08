import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import {
  calculateAge,
  getAgeGroup,
  formatEnumValue,
  aggregateByField,
  getTopN,
  groupByAgeRanges,
  getLastNMonths,
} from "@/lib/statistics"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Fetch all penduduk with minimal fields for statistics
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

    const totalPopulation = penduduk.length

    // Age Distribution
    const ageDistribution = groupByAgeRanges(penduduk.map((p) => p.tanggalLahir))

    // Gender Distribution
    const genderDistribution = aggregateByField(
      penduduk,
      "jenisKelamin",
      formatEnumValue
    )

    // Education Distribution
    const educationDistribution = aggregateByField(
      penduduk,
      "pendidikan",
      formatEnumValue
    )

    // Occupation Distribution (Top 10)
    const allOccupations = aggregateByField(penduduk, "pekerjaan")
    const occupationDistribution = getTopN(allOccupations, 10)

    // Religious Distribution
    const religionDistribution = aggregateByField(
      penduduk,
      "agama",
      formatEnumValue
    )

    // Marital Status Distribution
    const maritalStatusDistribution = aggregateByField(
      penduduk,
      "statusPerkawinan",
      formatEnumValue
    )

    // RT/RW Distribution (Top 10)
    const rtRwData = penduduk.map((p) => ({
      rtRw: `RT ${p.kk.rt}/RW ${p.kk.rw}`,
    }))
    const allRtRw = aggregateByField(rtRwData, "rtRw")
    const rtRwDistribution = getTopN(allRtRw, 10)

    // Monthly Registration Trend (Last 12 months)
    const monthNames = getLastNMonths(12)
    const monthlyTrend = monthNames.map((monthName) => {
      const [month, year] = monthName.split(" ")
      const monthIndex = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ].indexOf(month)
      
      const count = penduduk.filter((p) => {
        const createdDate = new Date(p.createdAt)
        return (
          createdDate.getMonth() === monthIndex &&
          createdDate.getFullYear() === parseInt(year)
        )
      }).length
      
      return { month: monthName, count }
    })

    // Calculate productive age (15-64 years)
    const productiveAge = penduduk.filter((p) => {
      const age = calculateAge(p.tanggalLahir)
      return age >= 15 && age <= 64
    }).length

    // Calculate children (0-14 years)
    const children = penduduk.filter((p) => {
      const age = calculateAge(p.tanggalLahir)
      return age < 15
    }).length

    // Calculate elderly (65+ years)
    const elderly = penduduk.filter((p) => {
      const age = calculateAge(p.tanggalLahir)
      return age >= 65
    }).length

    return NextResponse.json({
      totalPopulation,
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
      monthlyTrend,
    })
  } catch (error: any) {
    console.error("Statistics error:", error)
    return NextResponse.json(
      { message: "Failed to fetch statistics", error: error.message },
      { status: 500 }
    )
  }
}
