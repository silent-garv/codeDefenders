const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const { v4: uuidv4 } = require("uuid")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://code-defenders-cih-2-0-1vn9.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// In-memory storage for alerts (replace with MongoDB/SQLite for persistence)
class AlertDatabase {
  constructor() {
    this.alerts = []
    this.users = new Map()
    this.statistics = {
      totalAlerts: 0,
      highSeverityAlerts: 0,
      mediumSeverityAlerts: 0,
      lowSeverityAlerts: 0,
      alertsByType: {},
      alertsByHour: Array(24).fill(0),
    }
  }

  addAlert(alert) {
    const alertWithId = {
      ...alert,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      status: "active",
    }

    this.alerts.unshift(alertWithId) // Add to beginning for latest first

    // Keep only last 1000 alerts in memory
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(0, 1000)
    }

    this.updateStatistics(alertWithId)
    return alertWithId
  }

  updateStatistics(alert) {
    this.statistics.totalAlerts++

    // Count by severity
    switch (alert.severity?.toLowerCase()) {
      case "high":
      case "critical":
        this.statistics.highSeverityAlerts++
        break
      case "medium":
        this.statistics.mediumSeverityAlerts++
        break
      case "low":
        this.statistics.lowSeverityAlerts++
        break
    }

    // Count by type
    const type = alert.type || "Unknown"
    this.statistics.alertsByType[type] = (this.statistics.alertsByType[type] || 0) + 1

    // Count by hour
    const hour = new Date().getHours()
    this.statistics.alertsByHour[hour]++
  }

  getRecentAlerts(limit = 50) {
    return this.alerts.slice(0, limit)
  }

  getAlertsByUser(userId) {
    return this.alerts.filter((alert) => alert.userId === userId)
  }

  getStatistics() {
    return {
      ...this.statistics,
      recentAlerts: this.alerts.slice(0, 10),
      activeUsers: this.users.size,
      alertTrends: this.generateTrends(),
    }
  }

  generateTrends() {
    const last24Hours = Array(24).fill(0)
    const now = new Date()

    this.alerts.forEach((alert) => {
      const alertTime = new Date(alert.timestamp)
      const hoursDiff = Math.floor((now - alertTime) / (1000 * 60 * 60))
      if (hoursDiff < 24) {
        last24Hours[23 - hoursDiff]++
      }
    })

    return last24Hours
  }

  updateUser(userId, userData) {
    this.users.set(userId, {
      ...userData,
      lastSeen: new Date().toISOString(),
    })
  }
}

const db = new AlertDatabase()

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for development
  }),
)

app.use(
  cors({
    origin: ["http://localhost:3000", "https://code-defenders-cih-2-0-1vn9.vercel.app"],
    credentials: true,
  }),
)

// Rate limiting for API endpoints
const alertLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many alerts from this IP, please try again later.",
})

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Store connected clients
const connectedClients = new Map()

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`)
  connectedClients.set(socket.id, {
    connectedAt: new Date().toISOString(),
    userAgent: socket.handshake.headers["user-agent"],
  })

  // Send initial data to newly connected client
  socket.emit("initial-data", {
    alerts: db.getRecentAlerts(20),
    statistics: db.getStatistics(),
  })

  // Handle user identification
  socket.on("identify-user", (userData) => {
    db.updateUser(socket.id, userData)
    connectedClients.get(socket.id).user = userData
  })

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`)
    connectedClients.delete(socket.id)
  })
})

// API Routes

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
    totalAlerts: db.statistics.totalAlerts,
    uptime: process.uptime(),
  })
})

// Main alert endpoint - receives alerts from browser extension
app.post("/api/alerts", alertLimiter, (req, res) => {
  try {
    console.log("🚨 Incoming alert from extension:", req.body)

    // Validate required fields
    const requiredFields = ["type", "severity"]
    const missingFields = requiredFields.filter((field) => !req.body[field])

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
        received: Object.keys(req.body),
      })
    }

    // Enhanced alert data structure
    const alertData = {
      // Core alert information
      type: req.body.type,
      severity: req.body.severity,
      title: req.body.title || `${req.body.type} Detected`,
      description: req.body.description || "Suspicious activity detected by Cyber Sentinel",

      // Source information
      source: req.body.source || req.body.url || "Unknown",
      domain: req.body.domain || extractDomain(req.body.source || req.body.url),

      // User information
      user: req.body.user || "Anonymous",
      userId: req.body.userId || req.ip,

      // Browser/System information
      browser: req.body.browser || extractBrowser(req.headers["user-agent"]),
      userAgent: req.headers["user-agent"],
      ip: req.ip,

      // Additional context
      details: req.body.details || {},
      tags: req.body.tags || [],

      // Threat intelligence
      riskScore: calculateRiskScore(req.body),
      category: categorizeAlert(req.body.type),

      // Metadata
      extensionVersion: req.body.extensionVersion || "1.0.0",
      timestamp: new Date().toISOString(),
    }

    // Store alert in database
    const savedAlert = db.addAlert(alertData)

    // Broadcast to all connected dashboard clients immediately
    io.emit("new-alert", savedAlert)

    // Send updated statistics
    io.emit("statistics-update", db.getStatistics())

    console.log(`✅ Alert processed and broadcasted: ${savedAlert.title} (ID: ${savedAlert.id})`)

    // Send success response to extension
    res.status(200).json({
      success: true,
      alertId: savedAlert.id,
      message: "Alert received and processed successfully",
      timestamp: savedAlert.timestamp,
    })
  } catch (error) {
    console.error("❌ Error processing alert:", error)
    res.status(500).json({
      error: "Failed to process alert",
      message: error.message,
    })
  }
})

// Get all alerts with pagination and filtering
app.get("/api/alerts", (req, res) => {
  try {
    const { limit = 50, offset = 0, severity, type, user, since } = req.query

    let alerts = db.alerts

    // Apply filters
    if (severity) {
      alerts = alerts.filter((alert) => alert.severity?.toLowerCase() === severity.toLowerCase())
    }

    if (type) {
      alerts = alerts.filter((alert) => alert.type?.toLowerCase().includes(type.toLowerCase()))
    }

    if (user) {
      alerts = alerts.filter((alert) => alert.user?.toLowerCase().includes(user.toLowerCase()))
    }

    if (since) {
      const sinceDate = new Date(since)
      alerts = alerts.filter((alert) => new Date(alert.timestamp) > sinceDate)
    }

    // Apply pagination
    const paginatedAlerts = alerts.slice(Number.parseInt(offset), Number.parseInt(offset) + Number.parseInt(limit))

    res.json({
      alerts: paginatedAlerts,
      total: alerts.length,
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
    })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    res.status(500).json({ error: "Failed to fetch alerts" })
  }
})

// Get alert statistics and dashboard data
app.get("/api/statistics", (req, res) => {
  try {
    res.json(db.getStatistics())
  } catch (error) {
    console.error("Error fetching statistics:", error)
    res.status(500).json({ error: "Failed to fetch statistics" })
  }
})

// Get alerts for specific user
app.get("/api/alerts/user/:userId", (req, res) => {
  try {
    const { userId } = req.params
    const userAlerts = db.getAlertsByUser(userId)

    res.json({
      userId,
      alerts: userAlerts,
      count: userAlerts.length,
    })
  } catch (error) {
    console.error("Error fetching user alerts:", error)
    res.status(500).json({ error: "Failed to fetch user alerts" })
  }
})

// Update alert status (acknowledge, resolve, etc.)
app.patch("/api/alerts/:alertId", (req, res) => {
  try {
    const { alertId } = req.params
    const { status, notes } = req.body

    const alertIndex = db.alerts.findIndex((alert) => alert.id === alertId)

    if (alertIndex === -1) {
      return res.status(404).json({ error: "Alert not found" })
    }

    db.alerts[alertIndex] = {
      ...db.alerts[alertIndex],
      status,
      notes,
      updatedAt: new Date().toISOString(),
    }

    // Broadcast update to all clients
    io.emit("alert-updated", db.alerts[alertIndex])

    res.json({
      success: true,
      alert: db.alerts[alertIndex],
    })
  } catch (error) {
    console.error("Error updating alert:", error)
    res.status(500).json({ error: "Failed to update alert" })
  }
})

// Utility functions
function extractDomain(url) {
  if (!url) return "Unknown"
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function extractBrowser(userAgent) {
  if (!userAgent) return "Unknown"

  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  return "Unknown"
}

function calculateRiskScore(alertData) {
  let score = 0

  // Base score by severity
  switch (alertData.severity?.toLowerCase()) {
    case "critical":
      score += 90
      break
    case "high":
      score += 70
      break
    case "medium":
      score += 50
      break
    case "low":
      score += 20
      break
    default:
      score += 30
  }

  // Additional factors
  if (alertData.type?.toLowerCase().includes("phishing")) score += 20
  if (alertData.type?.toLowerCase().includes("malware")) score += 25
  if (alertData.type?.toLowerCase().includes("data")) score += 15

  return Math.min(score, 100)
}

function categorizeAlert(type) {
  const categories = {
    phishing: "Web Security",
    malware: "Malware",
    data: "Data Protection",
    clipboard: "System Security",
    form: "Privacy",
    network: "Network Security",
  }

  const lowerType = type?.toLowerCase() || ""
  for (const [key, category] of Object.entries(categories)) {
    if (lowerType.includes(key)) return category
  }

  return "General Security"
}

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Cyber Sentinel Server running on port ${PORT}`)
  console.log(`📊 Dashboard available at http://localhost:3000`)
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api/alerts`)
  console.log(`💡 WebSocket enabled for real-time updates`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully")
  server.close(() => {
    console.log("✅ Server closed")
    process.exit(0)
  })
})

// Generate some sample data for testing
setTimeout(() => {
  const sampleAlerts = [
    {
      type: "Phishing Link Detected",
      severity: "High",
      title: "Suspicious Phishing Attempt",
      description: "User clicked on a potentially malicious link",
      source: "https://fake-bank-login.malicious.com",
      user: "Yash",
      browser: "Chrome",
      details: {
        clickedElement: "Login Button",
        pageTitle: "Secure Bank Login",
      },
    },
    {
      type: "Clipboard Hijack Detected",
      severity: "Critical",
      title: "Clipboard Data Theft Attempt",
      description: "Malicious script attempted to access clipboard data",
      source: "https://crypto-exchange-fake.com",
      user: "Alex",
      browser: "Chrome",
      details: {
        dataType: "Cryptocurrency Address",
        blockedAttempts: 3,
      },
    },
    {
      type: "Form Data Sniffing",
      severity: "Medium",
      title: "Suspicious Form Monitoring",
      description: "Detected potential keylogger on login form",
      source: "https://suspicious-site.com/login",
      user: "Sarah",
      browser: "Firefox",
      details: {
        formFields: ["username", "password"],
        suspiciousScripts: 2,
      },
    },
  ]

  sampleAlerts.forEach((alert, index) => {
    setTimeout(
      () => {
        const savedAlert = db.addAlert(alert)
        io.emit("new-alert", savedAlert)
        console.log(`📝 Sample alert ${index + 1} added: ${alert.title}`)
      },
      (index + 1) * 2000,
    )
  })
}, 3000)
