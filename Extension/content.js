// content.js
console.log('Content script loaded.');

// --- Threat Detection Functions ---

// Detects suspicious SQL injection patterns in the URL query string
function checkURLForSQLInjection() {
    const sqlPatterns = [
        /('|%27)\s*(or|and)\s*('|%27)?\d+=\d+/i, // e.g. ' or 1=1
        /('|%27)\s*--/i,                        // e.g. ' --
        /('|%27);/i,                            // e.g. ';
        /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/i, // SQL keywords
        /(\bDROP\b|\bTABLE\b|\bDATABASE\b)/i
    ];
    const query = window.location.search;
    for (const pattern of sqlPatterns) {
        if (pattern.test(query)) {
            return {
                detected: true,
                pattern: pattern.toString(),
                message: "Potential SQL Injection pattern detected in URL."
            };
        }
    }
    return { detected: false };
}

// Detects phishing based on domain and page content
function detectPhishingPage() {
    const suspiciousKeywords = ['login', 'verify', 'update', 'password', 'bank', 'account', 'secure'];
    const suspiciousDomains = ['phishysite.com', 'malicious-site.net'];
    let details = [];
      
    let detected = false;
    if (suspiciousDomains.some(domain => window.location.hostname.includes(domain))) {
        detected = true;
        details.push('Suspicious domain detected: ' + window.location.hostname);
    }
    const bodyText = document.body.innerText.toLowerCase();
    suspiciousKeywords.forEach(keyword => {
        if (bodyText.includes(keyword)) {
            detected = true;
            details.push('Suspicious keyword found: ' + keyword);
        }
    });
    if (document.querySelector('input[type="password"]')) {
        detected = true;
        details.push('Password field detected on this page.');
    }
    return { detected, details };
}

// Checks for insecure cookies (no Secure/HttpOnly flags)
function checkInsecureCookies() {
    let insecureCookies = [];
    document.cookie.split(';').forEach(cookie => {
        if (cookie && !cookie.toLowerCase().includes('secure') && !cookie.toLowerCase().includes('httponly')) {
            insecureCookies.push(cookie.trim());
        }
    });
    if (insecureCookies.length > 0) {
        return {
            detected: true,
            details: ['Insecure cookies detected: ' + insecureCookies.join(', ')]
        };
    }
    return { detected: false };
}

// Example: Call a cybersecurity API for domain reputation (placeholder)
async function checkDomainReputationAPI(domain) {
    // Replace with your real API endpoint and key
    const apiUrl = `https://api.example.com/check-domain?domain=${encodeURIComponent(domain)}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return null;
        const data = await response.json();
        // Assume API returns { malicious: true/false, reason: "..." }
        if (data.malicious) {
            return { detected: true, details: [`API: Domain flagged as malicious. Reason: ${data.reason}`] };
        }
    } catch (e) { /* ignore errors for now */ }
    return { detected: false };
}

// --- Main Threat Detection Runner ---
(async function runAllThreatChecks() {
    let threatDetected = false;
    let threatDetails = [];

    // SQL Injection
    const sqlResult = checkURLForSQLInjection();
    if (sqlResult.detected) {
        threatDetected = true;
        threatDetails.push(sqlResult.message + ' Pattern: ' + sqlResult.pattern);
    }

    // Phishing
    const phishingResult = detectPhishingPage();
    if (phishingResult.detected) {
        threatDetected = true;
        threatDetails = threatDetails.concat(phishingResult.details);
    }

    // Insecure Cookies
    const cookieResult = checkInsecureCookies();
    if (cookieResult.detected) {
        threatDetected = true;
        threatDetails = threatDetails.concat(cookieResult.details);
    }

    // Domain Reputation API (async)
    const apiResult = await checkDomainReputationAPI(window.location.hostname);
    if (apiResult && apiResult.detected) {
        threatDetected = true;
        threatDetails = threatDetails.concat(apiResult.details);
    }

    if (threatDetected) {
        chrome.storage.local.set({
            threatAlert: {
                url: window.location.href,
                details: threatDetails,
                timestamp: Date.now()
            }
        });
    }
})();

// --- Threat Prevention Features (Content Script) ---
const blockedDomains = ['malicious.com', 'phishing-site.com'];

// 3. Prevent suspicious form submissions
function blockSuspiciousForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      try {
        const action = form.action || window.location.href;
        if (blockedDomains.some(domain => action.includes(domain))) {
          e.preventDefault();
          alert('Form submission blocked: suspicious destination.');
          console.log('Blocked form submission to:', action);
        }
      } catch (err) { console.error(err); }
    });
  });
}
blockSuspiciousForms();
const observer = new MutationObserver(blockSuspiciousForms);
observer.observe(document.body, { childList: true, subtree: true });

// 4. Intercept and block malicious fetch() and XMLHttpRequest calls
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) { 
    try {
      if (args[0] && blockedDomains.some(domain => args[0].includes(domain))) {
        console.log('Blocked fetch to:', args[0]);
        return Promise.reject(new Error('Blocked by extension'));
      }
    } catch (e) { console.error(e); }
    return originalFetch.apply(this, args);
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...rest) {
    try {
      if (blockedDomains.some(domain => url.includes(domain))) {
        console.log('Blocked XHR to:', url);
        throw new Error('Blocked by extension');
      }
    } catch (e) { console.error(e); }
    return originalOpen.call(this, method, url, ...rest);
  };
})();

// 5. Stop execution of dangerous scripts (like eval, atob, execCommand)
(function() {
  window.eval = function() {
    console.log('Blocked eval()');
    throw new Error('eval() is disabled by extension');
  };
  window.atob = function() {
    console.log('Blocked atob()');
    throw new Error('atob() is disabled by extension');
  };
  document.execCommand = function() {
    console.log('Blocked execCommand()');
    throw new Error('execCommand() is disabled by extension');
  };
})();

// Optional: Auto-close tab if high-severity threat is detected
function autoCloseTabIfHighThreat() {
  // Example: If a threat is detected, send message to background
  if (window.location.hostname.includes('malicious.com')) {
    chrome.runtime.sendMessage({ type: 'CLOSE_TAB' });
  }
}
autoCloseTabIfHighThreat();