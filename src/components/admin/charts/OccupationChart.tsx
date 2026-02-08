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

interface OccupationChartProps {
  data: Array<{ label: string; value: number }>
}

export default function OccupationChart({ data }: OccupationChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Jumlah",
        data: data.map((d) => d.value),
        backgroundColor: "#10B981",
        borderColor: "#059669",
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
        ticks: {
          maxRotation: 45,
          minRotation: 45,
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
