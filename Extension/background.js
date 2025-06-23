chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ CyberSentinel Extension installed and running");
});

// Log *all* requests to check URL matching works
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    console.log("🌐 Visited URL:", details.url);

    // Force alert trigger for all URLs for testing
    const shouldTrigger = true; // OR: details.url.includes("phishing")

    if (shouldTrigger) {
      console.log("🚨 Sending alert for:", details.url);

      fetch("https://codedefenders-cih-2-0.onrender.com/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `🚨 Detected site: ${details.url}`,
          timestamp: new Date().toISOString()
        })
      })
      .then(res => res.json())
      .then(data => console.log("✅ Sent to backend:", data))
      .catch(err => console.error("❌ Failed to send alert:", err));
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
