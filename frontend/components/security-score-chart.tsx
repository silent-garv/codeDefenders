"use client"

import type React from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { useTheme } from "next-themes"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface SecurityScoreChartProps {
  data: { timestamp: string; score: number }[]
}

const SecurityScoreChart: React.FC<SecurityScoreChartProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Set maximum value to 100 for security score
        min: 0, // Set minimum value to 0
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#6B7280",
          stepSize: 20, // Show ticks every 20 points
        },
      },
      x: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: isDark ? "#9CA3AF" : "#6B7280",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: isDark ? "#F3F4F6" : "#374151",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#374151" : "#F9FAFB",
        titleColor: isDark ? "#F3F4F6" : "#111827",
        bodyColor: isDark ? "#D1D5DB" : "#374151",
        borderColor: isDark ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  }

  const labels = data.map((item) => new Date(item.timestamp).toLocaleDateString())

  const datasets = [
    {
      label: "Security Score",
      data: data.map((item) => Math.min(Math.max(item.score, 0), 100)), // Clamp values between 0-100
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ]

  const chartData = {
    labels,
    datasets,
  }

  return <Line data={chartData} options={options} />
}

export default SecurityScoreChart
