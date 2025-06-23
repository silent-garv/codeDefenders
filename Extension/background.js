chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ CyberSentinel Extension installed and active");
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    if (url.includes("phishing") || url.includes("malware")) {
      console.log("🚨 Suspicious URL detected:", url);

      fetch("https://codedefenders-cih-2-0.onrender.com/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🚨 Suspicious site visited: ${url}`,
          timestamp: new Date().toISOString()
        })
      })
      .then(res => res.json())
      .then(data => console.log("✅ Alert sent:", data))
      .catch(err => console.error("❌ Failed to send alert:", err));
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);