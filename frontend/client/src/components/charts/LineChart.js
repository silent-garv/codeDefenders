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
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const LineChart = ({ data, title, isDark }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
        },
      },
      title: {
        display: true,
        text: title,
        color: isDark ? "#e5e7eb" : "#374151",
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
      },
      y: {
        ticks: {
          color: isDark ? "#9ca3af" : "#6b7280",
        },
        grid: {
          color: isDark ? "#374151" : "#e5e7eb",
        },
      },
    },
  }

  return <Line data={data} options={options} />
}

export default LineChart
