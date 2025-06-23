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
