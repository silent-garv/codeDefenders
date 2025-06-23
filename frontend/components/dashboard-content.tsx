"use client"

import type React from "react"
import { AlertTriangle, Activity, Shield, Users } from "react-feather"
import { motion } from "framer-motion"
import StatCard from "./stat-card"
import ThreatChart from "./threat-chart"
import AlertsChart from "./alerts-chart"
import { useRouter } from "next/navigation"

interface Alert {
  id: string
  title: string
  severity: "high" | "medium" | "low"
  timestamp: string
}

interface Person {
  id: string
  name: string
  riskLevel: "high" | "medium" | "low"
}

const DashboardContent: React.FC = () => {
  const router = useRouter()
  const alerts: Alert[] = [
    { id: "1", title: "Phishing Attempt Detected", severity: "high", timestamp: "2023-11-15T10:00:00" },
    { id: "2", title: "Suspicious Login from Unknown Location", severity: "medium", timestamp: "2023-11-15T11:30:00" },
    { id: "3", title: "Malware Detected in Attachment", severity: "high", timestamp: "2023-11-15T12:45:00" },
    { id: "4", title: "Unusual Network Activity", severity: "low", timestamp: "2023-11-15T14:00:00" },
  ]

  const people: Person[] = [
    { id: "1", name: "John Doe", riskLevel: "high" },
    { id: "2", name: "Jane Smith", riskLevel: "medium" },
    { id: "3", name: "Peter Jones", riskLevel: "low" },
    { id: "4", name: "Alice Brown", riskLevel: "high" },
  ]

  const recentAlerts: Alert[] = alerts.slice(0, 3)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => router.push("/alerts")}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatCard
            title="Total Alerts"
            value={alerts.length}
            icon={AlertTriangle}
            color="red"
            trend="up"
            trendValue="12%"
          />
        </div>
        <div
          onClick={() => router.push("/alerts")}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatCard
            title="Critical Alerts"
            value={alerts.filter((alert) => alert.severity === "high").length}
            icon={Shield}
            color="yellow"
            trend="down"
            trendValue="5%"
          />
        </div>
        <div
          onClick={() => router.push("/people")}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatCard
            title="High Risk Users"
            value={people.filter((person) => person.riskLevel === "high").length}
            icon={Users}
            color="purple"
          />
        </div>
        <div
          onClick={() => router.push("/monitoring")}
          className="cursor-pointer transform hover:scale-105 transition-transform"
        >
          <StatCard title="System Status" value="Secure" icon={Activity} color="green" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/monitoring")}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ThreatChart />
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push("/alerts")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AlertsChart />
        </motion.div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Alerts</h2>
        {recentAlerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => router.push("/alerts")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{alert.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{alert.timestamp}</p>
            </div>
            <div
              className={`text-sm font-semibold ${alert.severity === "high" ? "text-red-500" : alert.severity === "medium" ? "text-yellow-500" : "text-green-500"}`}
            >
              {alert.severity}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DashboardContent
