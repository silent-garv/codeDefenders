"use client"
import { motion } from "framer-motion"
import { useSocket } from "../contexts/SocketContext"
import { useTheme } from "../contexts/ThemeContext"
import StatCard from "../components/StatCard"
import LineChart from "../components/charts/LineChart"
import DoughnutChart from "../components/charts/DoughnutChart"
import { AlertTriangle, Shield, Users, Activity } from "lucide-react"

const Dashboard = () => {
  const { alerts, metrics, isConnected } = useSocket()
  const { isDark } = useTheme()

  // Prepare chart data
  const alertTrendData = {
    labels: metrics.alertTrends?.map((trend) => new Date(trend.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: "Alerts",
        data: metrics.alertTrends?.map((trend) => trend.count) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const threatCategoryData = {
    labels: Object.keys(metrics.threatCategories || {}),
    datasets: [
      {
        data: Object.values(metrics.threatCategories || {}),
        backgroundColor: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"],
        borderWidth: 2,
        borderColor: isDark ? "#374151" : "#ffffff",
      },
    ],
  }

  const recentAlerts = alerts.slice(0, 5)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time cybersecurity monitoring and threat detection</p>
      </motion.div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-red-800 dark:text-red-200">⚠️ Connection to server lost. Attempting to reconnect...</p>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Alerts"
          value={metrics.totalAlerts || 0}
          icon={AlertTriangle}
          color="red"
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Critical Alerts"
          value={metrics.criticalAlerts || 0}
          icon={Shield}
          color="yellow"
          trend="down"
          trendValue="5%"
        />
        <StatCard title="High Risk Users" value={metrics.highRiskUsers || 0} icon={Users} color="purple" />
        <StatCard title="System Status" value="Secure" icon={Activity} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="h-80">
            <LineChart data={alertTrendData} title="Alert Trends (Last 7 Days)" isDark={isDark} />
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-80">
            <DoughnutChart data={threatCategoryData} title="Threat Categories" isDark={isDark} />
          </div>
        </motion.div>
      </div>

      {/* Recent Alerts */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
        </div>
        <div className="p-6">
          {recentAlerts.length > 0 ? (
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{alert.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{alert.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : alert.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent alerts</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
