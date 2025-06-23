// Enhanced alert detection and sending
function detectAndSendAlert(alertType, details) {
  const alertData = {
    type: alertType,
    severity: determineSeverity(alertType),
    title: generateAlertTitle(alertType),
    description: details.description || `${alertType} detected on ${window.location.hostname}`,
    url: window.location.href,
    hostname: window.location.hostname,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    details: details,
  }

  // Send to CyberSentinel dashboard
  fetch("http://localhost:5000/api/alerts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alertData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("✅ Alert sent to CyberSentinel:", data)
      showNotification(`Security alert sent: ${alertData.title}`)
    })
    .catch((error) => {
      console.error("❌ Failed to send alert:", error)
    })
}

function determineSeverity(alertType) {
  const severityMap = {
    malware: "high",
    phishing: "high",
    "suspicious-download": "medium",
    "unsafe-website": "medium",
    tracking: "low",
    "cookie-warning": "low",
  }
  return severityMap[alertType] || "medium"
}

function generateAlertTitle(alertType) {
  const titleMap = {
    malware: "Malware Detected",
    phishing: "Phishing Attempt Blocked",
    "suspicious-download": "Suspicious Download Detected",
    "unsafe-website": "Unsafe Website Warning",
    tracking: "Tracking Script Detected",
    "cookie-warning": "Privacy Concern Detected",
  }
  return titleMap[alertType] || "Security Alert"
}

// Enhanced detection functions
function detectSuspiciousActivity() {
  // Check for suspicious forms
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input[type="password"], input[type="email"]')
    if (inputs.length > 0 && !window.location.protocol.includes("https")) {
      detectAndSendAlert("phishing", {
        description: "Insecure login form detected on non-HTTPS site",
        formAction: form.action,
        inputCount: inputs.length,
      })
    }
  })

  // Check for suspicious downloads
  const downloadLinks = document.querySelectorAll('a[href$=".exe"], a[href$=".zip"], a[href$=".rar"]')
  downloadLinks.forEach((link) => {
    link.addEventListener("click", () => {
      detectAndSendAlert("suspicious-download", {
        description: `Potentially dangerous file download: ${link.href}`,
        fileName: link.href.split("/").pop(),
        linkText: link.textContent,
      })
    })
  })

  // Check for tracking scripts
  const scripts = document.querySelectorAll("script[src]")
  const trackingDomains = ["google-analytics.com", "facebook.com", "doubleclick.net"]
  scripts.forEach((script) => {
    trackingDomains.forEach((domain) => {
      if (script.src.includes(domain)) {
        detectAndSendAlert("tracking", {
          description: `Tracking script detected: ${domain}`,
          scriptSrc: script.src,
        })
      }
    })
  })
}

// Run detection when page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", detectSuspiciousActivity)
} else {
  detectSuspiciousActivity()
}

// Monitor for dynamic content changes
const observer = new MutationObserver(() => {
  detectSuspiciousActivity()
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
