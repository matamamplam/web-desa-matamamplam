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

interface EducationChartProps {
  data: Array<{ label: string; value: number }>
}

export default function EducationChart({ data }: EducationChartProps) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Jumlah",
        data: data.map((d) => d.value),
        backgroundColor: [
          "#EF4444", // Red
          "#F59E0B", // Orange
          "#10B981", // Green
          "#3B82F6", // Blue
          "#8B5CF6", // Purple
          "#EC4899", // Pink
          "#06B6D4", // Cyan
          "#14B8A6", // Teal
          "#F97316", // Orange2
          "#A855F7", // Purple2
          "#EC4899", // Pink2
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    indexAxis: "y", // Horizontal bar
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Jumlah: ${context.parsed.x} orang`
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: "#f3f4f6",
        },
      },
      y: {
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
