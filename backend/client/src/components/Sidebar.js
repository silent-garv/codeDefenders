"use client"
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { Shield, BarChart3, AlertTriangle, Users, Settings, Home } from "lucide-react"

const Sidebar = () => {
  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/monitoring", icon: BarChart3, label: "Monitoring" },
    { path: "/alerts", icon: AlertTriangle, label: "Alerts" },
    { path: "/people", icon: Users, label: "People" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg border-r border-gray-200 dark:border-gray-700"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">CyberSentinel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Security Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="mt-8">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 text-blue-600 dark:text-blue-400"
                  : ""
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">System Status</p>
              <p className="text-xs opacity-90">All systems operational</p>
            </div>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
