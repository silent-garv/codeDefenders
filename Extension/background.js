chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ CyberSentinel background running");
});
  console.log('Istalled Extension.');
});

// --- Threat Prevention Features ---
// Keep blockedDomains in sync with content.js
const blockedDomains = ['malicious.com', 'phishing-site.com'];

// 1. Block navigation to malicious URLs
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    try {
      const url = new URL(details.url);
      if (blockedDomains.some(domain => url.hostname.includes(domain))) {
        console.log('Blocked navigation to:', url.hostname);
        return { cancel: true };
      }
    } catch (e) { console.error(e); }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// 2. Cancel downloads from flagged domains
chrome.downloads.onCreated.addListener(function(downloadItem) {
  try {
    const url = new URL(downloadItem.url);
    if (blockedDomains.some(domain => url.hostname.includes(domain))) {
      chrome.downloads.cancel(downloadItem.id, () => {
        console.log('Blocked download from:', url.hostname);
      });
    }
  } catch (e) { console.error(e); }
});

// 3. Auto-close the tab if a high-severity threat is detected
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === 'CLOSE_TAB' && sender.tab && sender.tab.id) {
    chrome.tabs.remove(sender.tab.id, () => {
      console.log('Closed tab due to high-severity threat');
    });
  }
});

// 4. AbuseIPDB API integration for IP/domain reputation
async function checkWithAbuseIPDB(ipOrDomain) {
  const apiKey = 'cc32320ab72c3bc44ff636f27a481beb868d26a04c7f4d85feaa6dc5fdde0139a0947b06ec46d1f2';
  const apiUrl = `https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ipOrDomain)}&maxAgeInDays=90`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Key': apiKey,
        'Accept': 'application/json'
      }
    });
    if (!response.ok) return false;
    const data = await response.json();
    // AbuseIPDB returns a 'data.abuseConfidenceScore' (0-100)
    if (data && data.data && data.data.abuseConfidenceScore >= 50) {
      console.log('Blocked by AbuseIPDB:', ipOrDomain, 'Score:', data.data.abuseConfidenceScore);
      return true;
    }
  } catch (e) {
    console.error('AbuseIPDB API error:', e);
    return false;
  }
  return false;
}

// Example usage: block navigation if AbuseIPDB flags the IP/domain
chrome.webRequest.onBeforeRequest.addListener(
  async function(details) {
    try {
      const url = new URL(details.url);
      if (blockedDomains.some(domain => url.hostname.includes(domain))) {
        console.log('Blocked navigation to:', url.hostname);
        return { cancel: true };
      }
      // Google Safe Browsing check
      const flagged = await checkWithGoogleSafeBrowsing(details.url);
      if (flagged) {
        console.log('Blocked by Google Safe Browsing:', details.url);
        return { cancel: true };
      }
      // AbuseIPDB check (use hostname or IP)
      const abuseFlagged = await checkWithAbuseIPDB(url.hostname);
      if (abuseFlagged) {
        return { cancel: true };
      }
    } catch (e) { console.error(e); }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
