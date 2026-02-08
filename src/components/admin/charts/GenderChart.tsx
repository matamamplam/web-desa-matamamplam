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

interface GenderChartProps {
  data: Array<{ label: string; value: number }>
}

export default function GenderChart({ data }: GenderChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: ["#3B82F6", "#EC4899"], // Blue for male, Pink for female
        borderColor: ["#ffffff", "#ffffff"],
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
          padding: 15,
          font: {
            size: 12,
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
