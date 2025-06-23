chrome.runtime.onInstalled.addListener(() => {
  console.log("🚀 CyberSentinel Extension Installed");
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const url = details.url;
    if (url.includes("phishing") || url.includes("malware")) {
      console.log("🚨 Suspicious URL detected:", url);
      fetch("https://codedefenders-cih-2-0.onrender.com/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: `🚨 Detected suspicious site: ${url}`,
          timestamp: new Date().toISOString()
        })
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);