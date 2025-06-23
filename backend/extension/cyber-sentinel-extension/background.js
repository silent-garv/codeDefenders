// Cyber Sentinel Background Script
class CyberSentinelBackground {
  constructor() {
    this.apiEndpoint = "http://localhost:5000/api/alerts"
    this.productionEndpoint = "https://your-backend-domain.com/api/alerts"
    this.alertQueue = []
    this.isOnline = true
    this.userId = null

    this.init()
  }

  async init() {
    console.log("🛡️ Cyber Sentinel Background Service Started")

    // Generate or retrieve user ID
    this.userId = await this.getUserId()

    // Set up event listeners
    this.setupEventListeners()

    // Check server connectivity
    this.checkServerConnection()

    // Process queued alerts periodically
    setInterval(() => this.processAlertQueue(), 5000)
  }

  async getUserId() {
    const result = await chrome.storage.local.get(["userId"])
    if (result.userId) {
      return result.userId
    }

    const newUserId = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
    await chrome.storage.local.set({ userId: newUserId })
    return newUserId
  }

  setupEventListeners() {
    // Listen for messages from content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "SECURITY_ALERT") {
        this.handleSecurityAlert(message.data, sender)
        sendResponse({ success: true })
      }
      return true
    })

    // Monitor tab updates for suspicious navigation
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        this.checkSuspiciousURL(changeInfo.url, tab)
      }
    })

    // Monitor web requests for malicious patterns
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
      this.analyzeNavigation(details)
    })
  }

  async handleSecurityAlert(alertData, sender) {
    try {
      const enhancedAlert = {
        ...alertData,
        userId: this.userId,
        tabId: sender.tab?.id,
        url: sender.tab?.url,
        title: sender.tab?.title,
        timestamp: new Date().toISOString(),
        extensionVersion: chrome.runtime.getManifest().version,
      }

      console.log("🚨 Security Alert Detected:", enhancedAlert)

      // Try to send immediately
      if (this.isOnline) {
        await this.sendAlert(enhancedAlert)
      } else {
        // Queue for later if offline
        this.alertQueue.push(enhancedAlert)
        console.log("📦 Alert queued (offline):", enhancedAlert.type)
      }

      // Show notification to user
      this.showNotification(enhancedAlert)
    } catch (error) {
      console.error("❌ Error handling security alert:", error)
      this.alertQueue.push(alertData) // Queue for retry
    }
  }

  async sendAlert(alertData) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alertData),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("✅ Alert sent successfully:", result)

      // Update badge to show alert count
      this.updateBadge()

      return result
    } catch (error) {
      console.error("❌ Failed to send alert:", error)

      // Mark as offline and queue the alert
      this.isOnline = false
      this.alertQueue.push(alertData)

      throw error
    }
  }

  async processAlertQueue() {
    if (this.alertQueue.length === 0) return

    console.log(`📤 Processing ${this.alertQueue.length} queued alerts...`)

    const alertsToProcess = [...this.alertQueue]
    this.alertQueue = []

    for (const alert of alertsToProcess) {
      try {
        await this.sendAlert(alert)
      } catch (error) {
        // Re-queue failed alerts
        this.alertQueue.push(alert)
      }
    }
  }

  async checkServerConnection() {
    try {
      const response = await fetch(`${this.apiEndpoint.replace("/alerts", "/health")}`)
      this.isOnline = response.ok
      console.log(`🌐 Server connection: ${this.isOnline ? "Online" : "Offline"}`)
    } catch (error) {
      this.isOnline = false
      console.log("🌐 Server connection: Offline")
    }

    // Check again in 30 seconds
    setTimeout(() => this.checkServerConnection(), 30000)
  }

  checkSuspiciousURL(url, tab) {
    const suspiciousPatterns = [
      /phishing/i,
      /malware/i,
      /suspicious/i,
      /fake.*bank/i,
      /secure.*login.*[0-9]+/i,
      /[a-z]+-[a-z]+-[0-9]+\.tk$/i, // Suspicious TLD patterns
      /bit\.ly\/[a-zA-Z0-9]{6,}/i, // Shortened URLs
    ]

    const isDangerous = suspiciousPatterns.some((pattern) => pattern.test(url))

    if (isDangerous) {
      this.handleSecurityAlert(
        {
          type: "Suspicious URL Navigation",
          severity: "Medium",
          title: "Potentially Dangerous Website",
          description: `Navigation to suspicious URL detected: ${url}`,
          source: url,
          details: {
            detectionMethod: "URL Pattern Analysis",
            tabTitle: tab.title,
          },
        },
        { tab },
      )
    }
  }

  analyzeNavigation(details) {
    // Check for suspicious redirects
    if (details.frameId === 0) {
      // Main frame only
      const url = details.url

      // Check for suspicious redirect patterns
      if (url.includes("redirect") && url.includes("http")) {
        this.handleSecurityAlert(
          {
            type: "Suspicious Redirect Detected",
            severity: "Medium",
            title: "Potential Redirect Attack",
            description: "Suspicious redirect pattern detected",
            source: url,
            details: {
              navigationId: details.navigationId,
              parentFrameId: details.parentFrameId,
            },
          },
          { tab: { id: details.tabId, url: details.url } },
        )
      }
    }
  }

  showNotification(alert) {
    const severity = alert.severity?.toLowerCase()
    const iconPath = severity === "high" || severity === "critical" ? "icons/alert-high.png" : "icons/alert-medium.png"

    chrome.notifications.create({
      type: "basic",
      iconUrl: iconPath,
      title: `🛡️ Cyber Sentinel Alert`,
      message: `${alert.type}: ${alert.title}`,
      priority: severity === "high" || severity === "critical" ? 2 : 1,
    })
  }

  async updateBadge() {
    const alertCount = await this.getAlertCount()
    chrome.action.setBadgeText({
      text: alertCount > 0 ? alertCount.toString() : "",
    })
    chrome.action.setBadgeBackgroundColor({ color: "#ff4444" })
  }

  async getAlertCount() {
    const result = await chrome.storage.local.get(["alertCount"])
    return result.alertCount || 0
  }
}

// Initialize the background service
new CyberSentinelBackground()
