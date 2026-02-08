"use client"

import { Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface MaritalStatusChartProps {
  data: Array<{ label: string; value: number }>
}

export default function MaritalStatusChart({ data }: MaritalStatusChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          "#3B82F6", // Blue - Belum Kawin
          "#10B981", // Green - Kawin
          "#F59E0B", // Orange - Cerai Hidup
          "#EF4444", // Red - Cerai Mati
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 10,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || ""
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <div className="h-full w-full">
      <Pie data={chartData} options={options} />
    </div>
  )
}
