chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ CyberSentinel background running");
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

// 5. Google Safe Browsing API integration for domain checks
async function checkWithGoogleSafeBrowsing(urlToCheck) {
  const apiKey = 'AIzaSyA0aDP_G1ADk82n79_UbWeF2vvlrlYLAEY';
  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  const body = {
    client: {
      clientId: "cybersentinal-extension",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [
        { url: urlToCheck }
      ]
    }
  };
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) return false;
    const data = await response.json();
    return !!(data && data.matches && data.matches.length > 0);
  } catch (e) {
    console.error('Safe Browsing API error:', e);
    return false;
  }
}

// 6. Block navigation if domain is in blockedDomains (synchronous only)
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

// You can still use Google Safe Browsing and AbuseIPDB checks, but NOT in a blocking listener.
// For example, you could notify the user or close the tab after navigation if a threat is detected.
