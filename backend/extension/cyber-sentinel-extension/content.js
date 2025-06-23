// Cyber Sentinel Content Script - Advanced Threat Detection
class CyberSentinelDetector {
  constructor() {
    this.alertsSent = 0
    this.suspiciousActivities = []
    this.originalClipboard = ""
    this.formInteractions = new Map()
    this.networkRequests = []

    this.init()
  }

  init() {
    console.log("🛡️ Cyber Sentinel Content Script Loaded")

    // Initialize all detection modules
    this.initPhishingDetection()
    this.initClipboardMonitoring()
    this.initFormSniffingDetection()
    this.initNetworkMonitoring()
    this.initDOMManipulationDetection()
    this.initCryptojackingDetection()

    // Start monitoring
    this.startMonitoring()
  }

  // 🎣 Phishing Detection
  initPhishingDetection() {
    // Monitor for suspicious links
    document.addEventListener("click", (event) => {
      const target = event.target
      if (target.tagName === "A" || target.closest("a")) {
        const link = target.tagName === "A" ? target : target.closest("a")
        this.analyzeLink(link, event)
      }
    })

    // Check current page for phishing indicators
    this.analyzeCurrentPage()
  }

  analyzeLink(link, event) {
    const href = link.href
    const text = link.textContent.trim()

    const phishingIndicators = [
      // Suspicious domains
      /[a-z]+-[a-z]+-[0-9]+\.(tk|ml|ga|cf)/i,
      /secure.*login.*[0-9]+/i,
      /paypal.*secure/i,
      /amazon.*verify/i,
      /microsoft.*security/i,

      // URL shorteners (potentially malicious)
      /bit\.ly|tinyurl|t\.co|goo\.gl/i,

      // Suspicious patterns
      /phishing|malware|suspicious/i,
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i, // IP addresses
    ]

    const isPhishing = phishingIndicators.some((pattern) => pattern.test(href))
    const textMismatch = href && text && !href.includes(text.replace(/[^a-zA-Z0-9]/g, ""))

    if (isPhishing || textMismatch) {
      event.preventDefault() // Block the click

      this.sendAlert({
        type: "Phishing Link Detected",
        severity: "High",
        title: "Malicious Link Blocked",
        description: `Potentially dangerous link blocked: ${href}`,
        source: href,
        details: {
          linkText: text,
          detectionReason: isPhishing ? "Suspicious domain pattern" : "Text/URL mismatch",
          pageTitle: document.title,
          blocked: true,
        },
      })

      // Show warning to user
      this.showInPageWarning("🚫 Malicious link blocked by Cyber Sentinel!")
    }
  }

  analyzeCurrentPage() {
    const url = window.location.href
    const title = document.title

    // Check for phishing page indicators
    const phishingKeywords = [
      "verify your account",
      "suspended account",
      "click here immediately",
      "urgent action required",
      "confirm your identity",
    ]

    const pageText = document.body.textContent.toLowerCase()
    const hasPhishingKeywords = phishingKeywords.some((keyword) => pageText.includes(keyword.toLowerCase()))

    // Check for fake login forms
    const loginForms = document.querySelectorAll('form[action*="login"], form input[type="password"]')
    const hasSuspiciousForm =
      loginForms.length > 0 &&
      (!url.includes("https://") || (url.includes("login") && !this.isLegitimateLoginPage(url)))

    if (hasPhishingKeywords || hasSuspiciousForm) {
      this.sendAlert({
        type: "Phishing Page Detected",
        severity: "High",
        title: "Potential Phishing Website",
        description: "Current page shows signs of phishing attempt",
        source: url,
        details: {
          hasPhishingKeywords,
          hasSuspiciousForm,
          formCount: loginForms.length,
          pageTitle: title,
        },
      })
    }
  }

  // 📋 Clipboard Monitoring
  initClipboardMonitoring() {
    // Monitor clipboard access attempts
    const originalReadText = navigator.clipboard.readText
    const originalWriteText = navigator.clipboard.writeText

    navigator.clipboard.readText = async function () {
      console.log("🔍 Clipboard read attempt detected")

      // Check if this is a legitimate read
      const stack = new Error().stack
      const isLegitimate = this.isLegitimateClipboardAccess(stack)

      if (!isLegitimate) {
        this.sendAlert({
          type: "Clipboard Access Attempt",
          severity: "Medium",
          title: "Unauthorized Clipboard Read",
          description: "Script attempted to read clipboard data",
          source: window.location.href,
          details: {
            stackTrace: stack,
            timestamp: new Date().toISOString(),
          },
        })
      }

      return originalReadText.apply(this, arguments)
    }.bind(this)

    navigator.clipboard.writeText = async function (text) {
      console.log("✏️ Clipboard write attempt detected")

      // Check for cryptocurrency address hijacking
      if (this.isCryptoAddress(text)) {
        this.sendAlert({
          type: "Clipboard Hijack Detected",
          severity: "Critical",
          title: "Cryptocurrency Address Hijacking",
          description: "Malicious script attempted to replace clipboard with crypto address",
          source: window.location.href,
          details: {
            originalText: text,
            detectionMethod: "Crypto address pattern matching",
          },
        })

        return // Block the write
      }

      return originalWriteText.apply(navigator.clipboard, arguments)
    }.bind(this)
  }

  // 📝 Form Sniffing Detection
  initFormSniffingDetection() {
    // Monitor form interactions
    document.addEventListener("input", (event) => {
      const input = event.target
      if (input.type === "password" || input.type === "email" || input.name?.includes("password")) {
        this.trackFormInteraction(input)
      }
    })

    // Monitor for suspicious event listeners on forms
    const originalAddEventListener = EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if ((type === "input" || type === "keydown") && this.tagName === "INPUT") {
        console.log("🔍 Suspicious form listener detected")

        // Analyze the listener function
        const listenerString = listener.toString()
        if (this.isSuspiciousFormListener(listenerString)) {
          this.sendAlert({
            type: "Form Sniffing Detected",
            severity: "High",
            title: "Keylogger Activity Detected",
            description: "Suspicious form monitoring script detected",
            source: window.location.href,
            details: {
              inputType: this.type,
              inputName: this.name,
              listenerCode: listenerString.substring(0, 200),
            },
          })
        }
      }

      return originalAddEventListener.call(this, type, listener, options)
    }.bind(this)
  }

  trackFormInteraction(input) {
    const formId = input.form?.id || "unknown"
    const interactions = this.formInteractions.get(formId) || []

    interactions.push({
      inputType: input.type,
      inputName: input.name,
      timestamp: Date.now(),
    })

    this.formInteractions.set(formId, interactions)

    // Check for rapid form filling (potential bot activity)
    if (interactions.length > 5) {
      const timeSpan = interactions[interactions.length - 1].timestamp - interactions[0].timestamp
      if (timeSpan < 1000) {
        // Less than 1 second for 5+ fields
        this.sendAlert({
          type: "Automated Form Filling",
          severity: "Medium",
          title: "Bot Activity Detected",
          description: "Unusually rapid form filling detected",
          source: window.location.href,
          details: {
            formId,
            interactionCount: interactions.length,
            timeSpan,
          },
        })
      }
    }
  }

  // 🌐 Network Monitoring
  initNetworkMonitoring() {
    // Monitor fetch requests
    const originalFetch = window.fetch
    window.fetch = async function (url, options) {
      console.log("🌐 Network request:", url)

      // Check for suspicious requests
      if (this.isSuspiciousRequest(url, options)) {
        this.sendAlert({
          type: "Suspicious Network Request",
          severity: "Medium",
          title: "Potentially Malicious Request",
          description: `Suspicious network request detected: ${url}`,
          source: window.location.href,
          details: {
            requestUrl: url,
            method: options?.method || "GET",
            hasCredentials: options?.credentials === "include",
          },
        })
      }

      return originalFetch.apply(this, arguments)
    }.bind(this)

    // Monitor XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url) {
      if (this.isSuspiciousRequest(url, { method })) {
        this.sendAlert({
          type: "Suspicious XHR Request",
          severity: "Medium",
          title: "Potentially Malicious XHR",
          description: `Suspicious XHR request: ${url}`,
          source: window.location.href,
          details: { requestUrl: url, method },
        })
      }

      return originalXHROpen.apply(this, arguments)
    }.bind(this)
  }

  // 🔄 DOM Manipulation Detection
  initDOMManipulationDetection() {
    // Monitor for suspicious DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.analyzeDOMAddition(node)
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  analyzeDOMAddition(element) {
    // Check for suspicious iframes
    if (element.tagName === "IFRAME") {
      const src = element.src
      if (src && (src.includes("data:") || this.isSuspiciousDomain(src))) {
        this.sendAlert({
          type: "Suspicious Iframe Injection",
          severity: "High",
          title: "Malicious Iframe Detected",
          description: "Suspicious iframe injected into page",
          source: window.location.href,
          details: {
            iframeSrc: src,
            injectionMethod: "DOM Manipulation",
          },
        })
      }
    }

    // Check for suspicious scripts
    if (element.tagName === "SCRIPT") {
      const src = element.src
      const content = element.textContent

      if (src && this.isSuspiciousDomain(src)) {
        this.sendAlert({
          type: "Malicious Script Injection",
          severity: "Critical",
          title: "Suspicious Script Loaded",
          description: "Script from suspicious domain injected",
          source: window.location.href,
          details: {
            scriptSrc: src,
            injectionMethod: "DOM Manipulation",
          },
        })
      }
    }
  }

  // ⛏️ Cryptojacking Detection
  initCryptojackingDetection() {
    // Monitor for high CPU usage patterns
    const cpuIntensiveOperations = 0

    // Override WebAssembly to detect crypto miners
    if (window.WebAssembly) {
      const originalInstantiate = WebAssembly.instantiate
      WebAssembly.instantiate = async function (bytes, imports) {
        console.log("🔍 WebAssembly instantiation detected")

        // Check for crypto mining patterns
        if (this.isCryptoMiningWasm(bytes)) {
          this.sendAlert({
            type: "Cryptojacking Detected",
            severity: "High",
            title: "Cryptocurrency Mining Detected",
            description: "Unauthorized cryptocurrency mining script detected",
            source: window.location.href,
            details: {
              detectionMethod: "WebAssembly Analysis",
              wasmSize: bytes.byteLength,
            },
          })
        }

        return originalInstantiate.apply(this, arguments)
      }.bind(this)
    }

    // Monitor for suspicious worker threads
    const originalWorker = window.Worker
    window.Worker = function (scriptURL, options) {
      console.log("👷 Web Worker created:", scriptURL)

      if (this.isSuspiciousWorker(scriptURL)) {
        this.sendAlert({
          type: "Suspicious Web Worker",
          severity: "Medium",
          title: "Potentially Malicious Worker",
          description: "Suspicious web worker detected",
          source: window.location.href,
          details: {
            workerScript: scriptURL,
            workerOptions: options,
          },
        })
      }

      return new originalWorker(scriptURL, options)
    }.bind(this)
  }

  // 🚨 Alert System
  async sendAlert(alertData) {
    try {
      // Send to background script
      if (typeof chrome !== "undefined" && chrome.runtime) {
        await chrome.runtime.sendMessage({
          type: "SECURITY_ALERT",
          data: {
            ...alertData,
            user: await this.getCurrentUser(),
            browser: this.getBrowserInfo(),
            pageInfo: {
              url: window.location.href,
              title: document.title,
              referrer: document.referrer,
            },
          },
        })

        this.alertsSent++
        console.log(`🚨 Alert sent: ${alertData.type}`)
      } else {
        console.warn("Chrome runtime is not available. Unable to send alert.")
      }
    } catch (error) {
      console.error("❌ Failed to send alert:", error)
    }
  }

  // 🔧 Utility Functions
  isLegitimateClipboardAccess(stack) {
    // Check if clipboard access is from user interaction
    const legitimatePatterns = [/click/i, /button/i, /copy/i, /paste/i]

    return legitimatePatterns.some((pattern) => pattern.test(stack))
  }

  isCryptoAddress(text) {
    const cryptoPatterns = [
      /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Bitcoin
      /^0x[a-fA-F0-9]{40}$/, // Ethereum
      /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/, // Litecoin
    ]

    return cryptoPatterns.some((pattern) => pattern.test(text))
  }

  isSuspiciousFormListener(listenerCode) {
    const suspiciousPatterns = [
      /keyCode|charCode/i,
      /send|post|ajax/i,
      /btoa|atob/i, // Base64 encoding
      /eval|Function/i,
    ]

    return suspiciousPatterns.some((pattern) => pattern.test(listenerCode))
  }

  isSuspiciousRequest(url, options) {
    const suspiciousDomains = [
      /malware/i,
      /phishing/i,
      /suspicious/i,
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i,
    ]

    return suspiciousDomains.some((pattern) => pattern.test(url))
  }

  isSuspiciousDomain(url) {
    const suspiciousPatterns = [
      /[a-z]+-[a-z]+-[0-9]+\.(tk|ml|ga|cf)/i,
      /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i,
      /malware|phishing|suspicious/i,
    ]

    return suspiciousPatterns.some((pattern) => pattern.test(url))
  }

  isLegitimateLoginPage(url) {
    const legitimateDomains = [
      "google.com",
      "facebook.com",
      "microsoft.com",
      "apple.com",
      "amazon.com",
      "paypal.com",
      "github.com",
    ]

    return legitimateDomains.some((domain) => url.includes(domain))
  }

  isCryptoMiningWasm(bytes) {
    // Simple heuristic - check for common crypto mining patterns
    const wasmString = new TextDecoder().decode(bytes.slice(0, 1000))
    const miningPatterns = [/cryptonight/i, /monero/i, /hash/i, /mining/i]

    return miningPatterns.some((pattern) => pattern.test(wasmString))
  }

  isSuspiciousWorker(scriptURL) {
    return this.isSuspiciousDomain(scriptURL) || scriptURL.includes("crypto") || scriptURL.includes("mining")
  }

  async getCurrentUser() {
    // Get user info from storage or generate anonymous ID
    const result = await chrome.storage.local.get(["userName"])
    return result.userName || "Anonymous User"
  }

  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
    }
  }

  showInPageWarning(message) {
    // Create and show warning overlay
    const warning = document.createElement("div")
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `
    warning.textContent = message

    document.body.appendChild(warning)

    setTimeout(() => {
      warning.remove()
    }, 5000)
  }

  startMonitoring() {
    console.log("🛡️ Cyber Sentinel monitoring started")
    console.log(`📊 Monitoring: Phishing, Clipboard, Forms, Network, DOM, Cryptojacking`)

    // Periodic health check
    setInterval(() => {
      console.log(`📈 Alerts sent: ${this.alertsSent}`)
    }, 60000)
  }
}

// Initialize the detector
new CyberSentinelDetector()
