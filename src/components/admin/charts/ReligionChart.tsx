"use client"

import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ReligionChartProps {
  data: Array<{ label: string; value: number }>
}

export default function ReligionChart({ data }: ReligionChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          "#10B981", // Green for Islam
          "#3B82F6", // Blue
          "#F59E0B", // Orange
          "#EC4899", // Pink
          "#8B5CF6", // Purple
          "#06B6D4", // Cyan
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
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
      <Doughnut data={chartData} options={options} />
    </div>
  )
}
