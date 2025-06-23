import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ data, title, isDark }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          padding: 20,
        },
      },
      title: {
        display: true,
        text: title,
        color: isDark ? "#e5e7eb" : "#374151",
      },
    },
  }

  return <Doughnut data={data} options={options} />
}

export default DoughnutChart
