"use client"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import { useSocket } from "../contexts/SocketContext"
import { Sun, Moon, Wifi, WifiOff, Bell } from "lucide-react"

const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  const { isConnected, alerts } = useSocket()

  const recentAlertsCount = alerts.filter((alert) => {
    const alertTime = new Date(alert.timestamp)
    const now = new Date()
    return now - alertTime < 3600000 // Last hour
  }).length

  return (
    <motion.header
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Dashboard</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <WifiOff className="h-4 w-4 mr-1" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <Bell className="h-5 w-5" />
              {recentAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {recentAlertsCount}
                </span>
              )}
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
