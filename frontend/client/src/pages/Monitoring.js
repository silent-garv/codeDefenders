"use client"
import { motion } from "framer-motion"
import { useSocket } from "../contexts/SocketContext"
import { useTheme } from "../contexts/ThemeContext"
import LineChart from "../components/charts/LineChart"
import BarChart from "../components/charts/BarChart"
import DoughnutChart from "../components/charts/DoughnutChart"
import StatCard from "../components/StatCard"
import { TrendingUp, AlertTriangle, Shield, Activity } from "lucide-react"

const Monitoring = () => {
  const { metrics } = useSocket()
  const { isDark } = useTheme()

  // Sample data for monitoring charts
  const incidentTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Security Incidents",
        data: [12, 19, 8, 15, 22, 18],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Resolved Incidents",
        data: [10, 17, 7, 13, 20, 16],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const threatMetricsData = {
    labels: ["Malware", "Phishing", "DDoS", "Intrusion", "Data Breach"],
    datasets: [
      {
        label: "Threat Count",
        data: [25, 18, 12, 8, 5],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(139, 92, 246, 0.8)",
        ],
        borderColor: [
          "rgb(239, 68, 68)",
          "rgb(249, 115, 22)",
          "rgb(234, 179, 8)",
          "rgb(59, 130, 246)",
          "rgb(139, 92, 246)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const systemHealthData = {
    labels: ["CPU", "Memory", "Disk", "Network"],
    datasets: [
      {
        data: [65, 78, 45, 82],
        backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
        borderWidth: 2,
        borderColor: isDark ? "#374151" : "#ffffff",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Monitoring</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time monitoring of security incidents and system health</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Threats" value="23" icon={AlertTriangle} color="red" trend="up" trendValue="8%" />
        <StatCard title="Blocked Attacks" value="156" icon={Shield} color="green" trend="up" trendValue="15%" />
        <StatCard title="System Uptime" value="99.9%" icon={Activity} color="blue" />
        <StatCard title="Response Time" value="2.3s" icon={TrendingUp} color="purple" trend="down" trendValue="0.5s" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Trends */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="h-80">
            <LineChart data={incidentTrendData} title="Security Incident Trends" isDark={isDark} />
          </div>
        </motion.div>

        {/* Threat Metrics */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-80">
            <BarChart data={threatMetricsData} title="Threat Categories" isDark={isDark} />
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-80">
            <DoughnutChart data={systemHealthData} title="System Health Status" isDark={isDark} />
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Real-time Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Network Traffic</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Normal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Firewall Status</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Intrusion Detection</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Monitoring</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Antivirus Status</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Updated</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Backup Status</span>
              <span className="text-yellow-600 dark:text-yellow-400 font-semibold">In Progress</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Monitoring
