// Cyber Sentinel Popup Script
class CyberSentinelPopup {
  constructor() {
    this.init()
  }

  async init() {
    console.log("🛡️ Cyber Sentinel Popup Loaded")

    // Load current stats
    await this.loadStats()

    // Set up event listeners
    this.setupEventListeners()

    // Check server connection
    this.checkServerConnection()

    // Update display every 5 seconds
    setInterval(() => this.loadStats(), 5000)
  }

  async loadStats() {
    try {
      // Get stats from storage
      const result = await chrome.storage.local.get(["alertCount", "threatsBlocked", "recentAlerts", "lastUpdate"])

      // Update display
      document.getElementById("alertCount").textContent = result.alertCount || 0
      document.getElementById("threatsBlocked").textContent = result.threatsBlocked || 0

      // Update recent alerts
      this.updateRecentAlerts(result.recentAlerts || [])
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  updateRecentAlerts(alerts) {
    const alertsList = document.getElementById("alertsList")

    if (alerts.length === 0) {
      alertsList.innerHTML = `
        <div style="text-align: center; opacity: 0.6; font-size: 12px;">
          No recent alerts
        </div>
      `
      return
    }

    alertsList.innerHTML = alerts
      .slice(0, 3)
      .map(
        (alert) => `
      <div class="alert-item">
        <div>
          <div class="alert-type severity-${alert.severity?.toLowerCase() || "medium"}">
            ${alert.type || "Security Alert"}
          </div>
        </div>
        <div class="alert-time">
          ${this.formatTime(alert.timestamp)}
        </div>
      </div>
    `,
      )
      .join("")
  }

  formatTime(timestamp) {
    if (!timestamp) return "Unknown"

    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now - alertTime
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  async checkServerConnection() {
    try {
      const response = await fetch("http://localhost:5000/health")
      const isConnected = response.ok

      const statusDot = document.getElementById("statusDot")
      const statusText = document.getElementById("statusText")
      const serverStatus = document.getElementById("serverStatus")

      if (isConnected) {
        statusDot.className = "status-dot active"
        statusText.textContent = "Protection Active"
        serverStatus.textContent = "Server: Connected"
      } else {
        statusDot.className = "status-dot inactive"
        statusText.textContent = "Protection Limited"
        serverStatus.textContent = "Server: Disconnected"
      }
    } catch (error) {
      const statusDot = document.getElementById("statusDot")
      const statusText = document.getElementById("statusText")
      const serverStatus = document.getElementById("serverStatus")

      statusDot.className = "status-dot inactive"
      statusText.textContent = "Protection Limited"
      serverStatus.textContent = "Server: Offline"
    }
  }

  setupEventListeners() {
    // Open dashboard button
    document.getElementById("openDashboard").addEventListener("click", () => {
      chrome.tabs.create({
        url: "http://localhost:3000",
      })
      window.close()
    })

    // Settings button
    document.getElementById("settingsBtn").addEventListener("click", () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("options.html"),
      })
      window.close()
    })
  }
}

// Initialize popup
new CyberSentinelPopup()
