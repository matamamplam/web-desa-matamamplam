"use client"

import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface AgeDistributionChartProps {
  data: Array<{ range: string; count: number }>
}

export default function AgeDistributionChart({ data }: AgeDistributionChartProps) {
  const chartData = {
    labels: data.map((d) => d.range),
    datasets: [
      {
        label: "Jumlah Penduduk",
        data: data.map((d) => d.count),
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Jumlah: ${context.parsed.y} orang`
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "#f3f4f6",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}
