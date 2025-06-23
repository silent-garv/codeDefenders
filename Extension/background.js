// background.js
chrome.runtime.onInstalled.addListener(() => {
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

// 6. Auto-close the tab if a high-severity threat is detected
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg && msg.type === 'CLOSE_TAB' && sender.tab && sender.tab.id) {
    chrome.tabs.remove(sender.tab.id, () => {
      console.log('Closed tab due to high-severity threat');
    });
  }
});

// 7. Google Safe Browsing API integration for domain checks
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

// Example usage: block navigation if Google Safe Browsing flags the URL
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
    } catch (e) { console.error(e); }
    return {};
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
