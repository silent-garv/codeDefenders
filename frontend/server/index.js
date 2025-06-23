const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const helmet = require("helmet")
const { v4: uuidv4 } = require("uuid")
const Database = require("./database")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Initialize database
const db = new Database()

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-auth0-domain.auth0.com"],
    credentials: true,
  }),
)
app.use(express.json())

// Store connected clients
const connectedClients = new Set()

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)
  connectedClients.add(socket.id)

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
    connectedClients.delete(socket.id)
  })

  // Send initial data to newly connected client
  socket.emit("initial-data", {
    alerts: db.getRecentAlerts(),
    people: db.getAllPeople(),
    metrics: db.getMetrics(),
  })
})

// API Routes

// Add middleware to log all incoming alerts
app.use("/api/alerts", (req, res, next) => {
  console.log("📨 Incoming alert from browser extension:", req.body)
  next()
})

// Receive alerts from browser extension
app.post("/api/alerts", (req, res) => {
  try {
    const alertData = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      source: req.body.source || "Browser Extension",
      type: req.body.type || "security",
      severity: req.body.severity || "medium",
      title: req.body.title || "Security Alert",
      description: req.body.description || "Alert detected by browser extension",
      url: req.body.url || "",
      userAgent: req.headers["user-agent"] || "",
      ...req.body,
    }

    // Store alert in database
    db.addAlert(alertData)

    // Broadcast to all connected clients immediately
    io.emit("new-alert", alertData)

    // Log for debugging
    console.log("🚨 New alert processed and broadcasted:", alertData.title)

    // Update metrics
    const updatedMetrics = db.updateMetrics(alertData)
    io.emit("metrics-update", updatedMetrics)

    res.status(200).json({
      success: true,
      alertId: alertData.id,
      message: "Alert received and processed successfully",
    })
  } catch (error) {
    console.error("❌ Error processing alert:", error)
    res.status(500).json({ error: "Failed to process alert" })
  }
})

// Get all alerts
app.get("/api/alerts", (req, res) => {
  try {
    const alerts = db.getAllAlerts()
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alerts" })
  }
})

// Get people data
app.get("/api/people", (req, res) => {
  try {
    const people = db.getAllPeople()
    res.json(people)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch people data" })
  }
})

// Update person risk level
app.put("/api/people/:id", (req, res) => {
  try {
    const { id } = req.params
    const { riskLevel } = req.body

    db.updatePersonRisk(id, riskLevel)
    const updatedPeople = db.getAllPeople()

    io.emit("people-update", updatedPeople)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to update person" })
  }
})

// Get metrics
app.get("/api/metrics", (req, res) => {
  try {
    const metrics = db.getMetrics()
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch metrics" })
  }
})

// Settings endpoints
app.get("/api/settings", (req, res) => {
  try {
    const settings = db.getSettings()
    res.json(settings)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" })
  }
})

app.put("/api/settings", (req, res) => {
  try {
    db.updateSettings(req.body)
    io.emit("settings-update", req.body)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: "Failed to update settings" })
  }
})

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    connectedClients: connectedClients.size,
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 CyberSentinel Server running on port ${PORT}`)
  console.log(`📊 Dashboard available at http://localhost:3000`)
})

// Simulate some initial data and periodic updates
setTimeout(() => {
  // Add some sample data
  const sampleAlerts = [
    {
      id: uuidv4(),
      type: "malware",
      severity: "high",
      title: "Malware Detected",
      description: "Suspicious executable detected in downloads folder",
      source: "john.doe@company.com",
      timestamp: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      type: "phishing",
      severity: "medium",
      title: "Phishing Attempt",
      description: "Suspicious email with malicious links detected",
      source: "jane.smith@company.com",
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
  ]

  sampleAlerts.forEach((alert) => {
    db.addAlert(alert)
    io.emit("new-alert", alert)
  })

  console.log("📝 Sample data initialized")
}, 2000)

// Periodic metrics update
setInterval(() => {
  const metrics = db.getMetrics()
  io.emit("metrics-update", metrics)
}, 30000) // Update every 30 seconds
